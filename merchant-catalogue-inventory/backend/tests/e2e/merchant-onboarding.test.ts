import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { PrismaClient, type Role } from "@prisma/client";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.js";
import { reserveInventory } from "../../src/modules/inventory/inventory.service.js";
import { startS3TestStorage } from "./s3-test-storage.js";

const db = new PrismaClient();
const secret = randomUUID();
const accountIds: string[] = [];
const categoryIds: string[] = [];
const password = randomUUID();
let server: Server;
let baseUrl: string;
let owner: { id: string; email: string | null };
let peer: { id: string; email: string | null };
let admin: { id: string; email: string | null };
let imageStore: Awaited<ReturnType<typeof startS3TestStorage>>;

async function createAccount(role: Role, passwordHash: string) {
  const user = await db.user.create({
    data: {
      email: `${randomUUID()}@example.test`,
      firstName: "Merchant",
      lastName: "Test",
      passwordHash,
      status: "ACTIVE",
      roles: { create: { role } },
    },
    select: { id: true, email: true },
  });
  accountIds.push(user.id);
  return user;
}

function token(user: { id: string }) {
  return jwt.sign({ roles: ["ADMIN"] }, secret, { subject: user.id, expiresIn: "5m" });
}

function request(path: string, method = "GET", bearer?: string, body?: unknown, key?: string) {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(bearer && { Authorization: `Bearer ${bearer}` }),
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(key && { "Idempotency-Key": key }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

beforeAll(async () => {
  const hash = await argon2.hash(password);
  owner = await createAccount("MERCHANT", hash);
  peer = await createAccount("MERCHANT", hash);
  admin = await createAccount("ADMIN", hash);
  imageStore = await startS3TestStorage();
  server = createApp(db, secret, imageStore.storage).listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
  await imageStore?.close();
  try {
    await db.auditLog.deleteMany({ where: { actorUserId: { in: accountIds } } });
    await db.inventoryMovement.deleteMany({
      where: { inventory: { product: { merchant: { ownerUserId: { in: accountIds } } } } },
    });
    await db.product.deleteMany({ where: { merchant: { ownerUserId: { in: accountIds } } } });
    for (const id of categoryIds.reverse()) {
      await db.productCategory.deleteMany({ where: { id } });
    }
    await db.merchant.deleteMany({ where: { ownerUserId: { in: accountIds } } });
    await db.user.deleteMany({ where: { id: { in: accountIds } } });
  } finally {
    await db.$disconnect();
  }
});

describe("product image HTTP API", () => {
  it("verifies uploaded content and issues short-lived URLs only for authorized images", async () => {
    const account = await createAccount("MERCHANT", await argon2.hash(password));
    const bearer = token(account);
    const merchant = await db.merchant.create({
      data: {
        ownerUserId: account.id, name: "Image merchant", slug: `images-${randomUUID()}`,
        status: "ACTIVE", isPublic: true,
      },
    });
    const product = await db.product.create({
      data: { merchantId: merchant.id, name: "Image product", slug: "image-product", unitPrice: "1.00" },
    });
    const route = "/api/v1/uploads/presign";
    const ownerImages = `/api/v1/merchant/products/${product.id}/images`;
    const publicImages = `/api/v1/products/${product.id}/images`;
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2f8AAAAASUVORK5CYII=", "base64",
    );
    const buildUpload = (bytes: Buffer) => ({
      productId: product.id,
      contentType: "image/png",
      sizeBytes: bytes.length,
      checksumSha256: createHash("sha256").update(bytes).digest("base64"),
    });
    const input = buildUpload(png);
    expect((await request(route, "POST", undefined, input)).status).toBe(401);
    expect((await request(route, "POST", token(peer), input)).status).toBe(404);
    expect((await request(route, "POST", bearer, { ...input, contentType: "image/svg+xml" })).status).toBe(400);
    expect((await request(route, "POST", bearer, { ...input, sizeBytes: 5 * 1024 * 1024 + 1 })).status).toBe(400);
    expect((await request(route, "POST", bearer, { ...input, checksumSha256: "invalid" })).status).toBe(400);

    const issued = await request(route, "POST", bearer, input);
    expect(issued.status).toBe(201);
    expect(issued.headers.get("cache-control")).toBe("no-store");
    const { data: ticket } = await issued.json();
    expect(ticket).toMatchObject({ method: "PUT", expiresIn: 300 });
    const uploadQuery = new URL(ticket.url).searchParams;
    expect(uploadQuery.get("X-Amz-Expires")).toBe("300");
    expect(uploadQuery.get("X-Amz-SignedHeaders")?.split(";")).toEqual([
      "content-length", "content-type", "host", "if-none-match", "x-amz-checksum-sha256",
    ]);
    const complete = `${ownerImages}/${ticket.imageId}/complete`;
    expect((await request(complete, "POST", token(peer))).status).toBe(404);
    expect((await request(complete, "POST", bearer)).status).toBe(409);
    expect((await request(`${ownerImages}/${ticket.imageId}`, "GET", bearer)).status).toBe(404);

    const differentBytes = Buffer.from(png);
    differentBytes[20] ^= 1;
    const rejected = await fetch(ticket.url, { method: ticket.method, headers: ticket.headers, body: differentBytes });
    expect(rejected.status).toBe(400);
    const written = await fetch(ticket.url, { method: ticket.method, headers: ticket.headers, body: png });
    expect(written.status).toBe(200);
    const overwritten = await fetch(ticket.url, { method: ticket.method, headers: ticket.headers, body: png });
    expect(overwritten.status).toBe(412);
    const registered = await request(complete, "POST", bearer);
    expect(registered.status).toBe(200);
    const { data: ready } = await registered.json();
    expect(ready).toMatchObject({ id: ticket.imageId, contentType: "image/png", sizeBytes: png.length });
    expect((await (await request(complete, "POST", bearer)).json()).data).toEqual(ready);

    expect((await request(ownerImages, "GET", token(peer))).status).toBe(404);
    expect((await (await request(ownerImages, "GET", bearer)).json()).data).toEqual([ready]);
    expect((await request(publicImages)).status).toBe(404);
    expect((await request(`${publicImages}/${ticket.imageId}`)).status).toBe(404);
    const ownerRead = await request(`${ownerImages}/${ticket.imageId}`, "GET", bearer);
    expect(ownerRead.headers.get("cache-control")).toBe("no-store");
    const signedRead = (await ownerRead.json()).data;
    expect(new URL(signedRead.url).searchParams.get("X-Amz-Expires")).toBe("60");
    const downloaded = await fetch(signedRead.url);
    expect(Buffer.from(await downloaded.arrayBuffer())).toEqual(png);

    const html = Buffer.from("<html><body>This is not an image.</body></html>");
    const invalid = (await (await request(route, "POST", bearer, buildUpload(html))).json()).data;
    expect((await fetch(invalid.url, { method: invalid.method, headers: invalid.headers, body: html })).status).toBe(200);
    const invalidComplete = `${ownerImages}/${invalid.imageId}/complete`;
    expect((await request(invalidComplete, "POST", bearer)).status).toBe(409);
    await db.productImage.update({ where: { id: invalid.imageId }, data: { expiresAt: new Date(0) } });
    expect((await request(invalidComplete, "POST", bearer)).status).toBe(410);

    const status = `/api/v1/merchant/products/${product.id}/status`;
    expect((await request(status, "PATCH", bearer, { status: "PUBLISHED" })).status).toBe(200);
    expect((await (await request(publicImages)).json()).data).toEqual([ready]);
    expect((await request(`${publicImages}/${ticket.imageId}`)).status).toBe(200);
    await db.merchant.update({ where: { id: merchant.id }, data: { status: "SUSPENDED", isPublic: false } });
    expect((await request(`${publicImages}/${ticket.imageId}`)).status).toBe(404);
  });
});

describe("merchant inventory HTTP API", () => {
  async function setupStockProduct() {
    const account = await createAccount("MERCHANT", await argon2.hash(password));
    const merchant = await db.merchant.create({
      data: { ownerUserId: account.id, name: "Stock merchant", slug: `stock-${randomUUID()}` },
    });
    // A legacy product from before the API began creating inventory rows.
    const product = await db.product.create({
      data: { merchantId: merchant.id, name: "Stock product", slug: "stock-product", unitPrice: "1.00" },
    });
    return {
      product,
      bearer: token(account),
      path: `/api/v1/merchant/products/${product.id}/inventory`,
    };
  }

  it("initializes legacy stock and replays a completed request without undoing later adjustments", async () => {
    const { product, bearer, path } = await setupStockProduct();
    expect((await request(path)).status).toBe(401);
    expect((await request(path, "GET", token(peer))).status).toBe(404);
    expect((await request(path, "PUT", token(peer), { quantityOnHand: 9 }, "foreign")).status).toBe(404);
    expect((await request(path + "/movements", "GET", token(peer))).status).toBe(404);
    expect((await request(path, "GET", bearer)).status).toBe(200);
    expect((await (await request(path, "GET", bearer)).json()).data)
      .toMatchObject({ quantityOnHand: 0, availableQuantity: 0, updatedAt: null });
    expect(await db.inventory.count({ where: { productId: product.id } })).toBe(0);
    expect((await request(path, "PUT", bearer, { quantityOnHand: 10 })).status).toBe(400);
    expect((await request(path + "/adjustments", "POST", bearer, { quantityDelta: 0 }, "zero")).status).toBe(400);

    const original = await request(path, "PUT", bearer, { quantityOnHand: 10, lowStockLevel: 3 }, "set-stock");
    expect(original.status).toBe(200);
    const originalData = (await original.json()).data;
    expect(originalData).toMatchObject({ quantityOnHand: 10, availableQuantity: 10, lowStockLevel: 3 });
    const threshold = await request(path, "PUT", bearer, { quantityOnHand: 10, lowStockLevel: 4 }, "only-threshold");
    expect((await threshold.json()).data).toMatchObject({ quantityOnHand: 10, lowStockLevel: 4, movementId: null });
    const adjust = await request(path + "/adjustments", "POST", bearer, { quantityDelta: 2, note: "Delivery" }, "receipt");
    expect(adjust.status).toBe(200);
    expect((await adjust.json()).data).toMatchObject({ quantityOnHand: 12, lowStockLevel: 4 });
    expect((await (await request(path, "PUT", bearer, { lowStockLevel: 3, quantityOnHand: 10 }, "set-stock")).json()).data)
      .toEqual(originalData);
    expect((await request(path + "/adjustments", "POST", bearer, { quantityDelta: 4 }, "receipt")).status).toBe(409);
    expect((await request(path + "/adjustments", "POST", bearer, { quantityDelta: 4 }, "set-stock")).status).toBe(409);
    expect((await (await request(path, "GET", bearer)).json()).data).toMatchObject({ quantityOnHand: 12, lowStockLevel: 4 });

    const moves = await request(path + "/movements?limit=1", "GET", bearer);
    expect(await moves.json()).toMatchObject({
      data: [{ movementType: "ADJUSTMENT", quantityDelta: 2, note: "Delivery" }],
      pagination: { totalItems: 2, totalPages: 2 },
    });

    expect((await request(`/api/v1/merchant/products/${product.id}`, "DELETE", bearer)).status).toBe(204);
    expect((await request(path + "/adjustments", "POST", bearer, { quantityDelta: 1 }, "archived")).status).toBe(404);
    expect((await request(path, "GET", bearer)).status).toBe(200);
    expect((await (await request(path, "PUT", bearer, { quantityOnHand: 10, lowStockLevel: 3 }, "set-stock")).json()).data)
      .toEqual(originalData);
  });

  it("applies concurrent retries once and serializes stock changes against reservations", async () => {
    const { product, bearer, path } = await setupStockProduct();
    const adjustments = path + "/adjustments";
    const duplicated = await Promise.all([
      request(adjustments, "POST", bearer, { quantityDelta: 10 }, "concurrent-same-key"),
      request(adjustments, "POST", bearer, { quantityDelta: 10 }, "concurrent-same-key"),
    ]);
    expect(duplicated.map(({ status }) => status)).toEqual([200, 200]);
    const [first, second] = await Promise.all(duplicated.map((response) => response.json()));
    expect(first.data).toEqual(second.data);
    expect(first.data.quantityOnHand).toBe(10);
    await reserveInventory(db, { productId: product.id, orderId: randomUUID(), quantity: 6, idempotencyKey: randomUUID() });
    expect((await request(path, "PUT", bearer, { quantityOnHand: 5 }, "below-reservations")).status).toBe(409);

    const competing = await Promise.all([
      request(adjustments, "POST", bearer, { quantityDelta: -3 }, "first-deduction"),
      request(adjustments, "POST", bearer, { quantityDelta: -3 }, "second-deduction"),
    ]);
    expect(competing.map(({ status }) => status).sort()).toEqual([200, 409]);
    expect((await (await request(path, "GET", bearer)).json()).data)
      .toMatchObject({ quantityOnHand: 7, quantityReserved: 6, availableQuantity: 1 });
    expect(await db.inventoryMovement.count({ where: { inventory: { productId: product.id }, movementType: "ADJUSTMENT" } })).toBe(2);

    const [reservationWon, lastDeduction] = await Promise.all([
      reserveInventory(db, { productId: product.id, orderId: randomUUID(), quantity: 1, idempotencyKey: randomUUID() })
        .then(() => true, () => false),
      request(adjustments, "POST", bearer, { quantityDelta: -1 }, "last-available-unit"),
    ]);
    expect(lastDeduction.status).toBe(reservationWon ? 409 : 200);
    expect((await (await request(path, "GET", bearer)).json()).data)
      .toMatchObject({ availableQuantity: 0, quantityReserved: reservationWon ? 7 : 6 });
  });
});

describe("merchant product catalogue HTTP API", () => {
  const products = "/api/v1/merchant/products";
  const categories = "/api/v1/admin/product-categories";

  async function createCategory(parentId?: string) {
    const slug = `category-${randomUUID()}`;
    const created = await request(categories, "POST", token(admin), { slug, name: slug, parentId });
    expect(created.status).toBe(201);
    const { data } = await created.json();
    categoryIds.push(data.id);
    return data.id as string;
  }

  it("lets administrators manage the shared taxonomy and merchants browse it", async () => {
    const slug = `category-${randomUUID()}`;
    expect((await request(categories, "POST", token(owner), { slug, name: slug })).status).toBe(403);
    expect((await request(categories, "POST", token(admin), { slug, name: slug, parentId: randomUUID() })).status).toBe(404);

    const parent = await createCategory();
    const child = await createCategory(parent);
    const update = await request(`${categories}/${child}`, "PATCH", token(admin), { name: "Updated category " + child });
    expect(update.status).toBe(200);
    expect((await update.json()).data).toMatchObject({ id: child, parentId: parent });
    expect((await request(`${categories}/${parent}`, "DELETE", token(admin))).status).toBe(409);
    const listed = await request("/api/v1/merchant/product-categories?limit=100", "GET", token(owner));
    expect(listed.status).toBe(200);
    expect((await listed.json()).data).toEqual(expect.arrayContaining([expect.objectContaining({ id: child })]));
    expect((await request(`${categories}/${child}`, "DELETE", token(admin))).status).toBe(204);
    expect((await request(`${categories}/${parent}`, "DELETE", token(admin))).status).toBe(204);
  });

  it("scopes products to their owner and verifies category, price and lifecycle rules", async () => {
    const hash = await argon2.hash(password);
    const first = await createAccount("MERCHANT", hash);
    const second = await createAccount("MERCHANT", hash);
    const firstToken = token(first);
    const secondToken = token(second);
    const merchant = await db.merchant.create({
      data: { ownerUserId: first.id, name: "First catalogue", slug: `first-${randomUUID()}` },
    });
    await db.merchant.create({
      data: { ownerUserId: second.id, name: "Second catalogue", slug: `second-${randomUUID()}`, status: "ACTIVE" },
    });
    const categoryId = await createCategory();
    const input = { name: "Test product", slug: "test-product", sku: "test-1", unitPrice: "24.50", categoryIds: [categoryId] };

    expect((await request(products, "POST", firstToken, { ...input, unitPrice: "24.555" })).status).toBe(400);
    expect((await request(products, "POST", firstToken, { ...input, merchantId: merchant.id })).status).toBe(400);
    expect((await request(products, "POST", firstToken, { ...input, categoryIds: [randomUUID()] })).status).toBe(400);
    const created = await request(products, "POST", firstToken, input);
    expect(created.status).toBe(201);
    const { data: product } = await created.json();
    expect(product).toMatchObject({
      status: "DRAFT", unitPrice: "24.50", currency: "GHS", merchantId: merchant.id, categories: [{ id: categoryId }],
    });
    expect(await db.inventory.findUnique({ where: { productId: product.id } }))
      .toMatchObject({ quantityOnHand: 0, quantityReserved: 0 });
    expect((await request(products, "POST", firstToken, input)).status).toBe(409);
    expect((await request(products, "POST", secondToken, input)).status).toBe(201);
    expect((await request(`${categories}/${categoryId}`, "DELETE", token(admin))).status).toBe(409);

    const path = `${products}/${product.id}`;
    expect((await request(path, "GET", secondToken)).status).toBe(404);
    expect((await request(path, "PATCH", secondToken, { name: "Other product" })).status).toBe(404);
    expect((await request(path + "/status", "PATCH", secondToken, { status: "PUBLISHED" })).status).toBe(404);
    expect((await request(path + "/availability", "PATCH", secondToken, { isAvailable: false })).status).toBe(404);
    expect((await request(path, "DELETE", secondToken)).status).toBe(404);

    const listed = await request(products, "GET", firstToken);
    expect((await listed.json()).data).toMatchObject([{ id: product.id }]);
    const rejected = await request(path, "PATCH", firstToken, { unitPrice: "30", categoryIds: [randomUUID()] });
    expect(rejected.status).toBe(400);
    expect((await (await request(path, "GET", firstToken)).json()).data).toMatchObject({
      unitPrice: "24.50", categories: [{ id: categoryId }],
    });
    const updated = await request(path, "PATCH", firstToken, {
      description: "Updated description", unitPrice: "30", categoryIds: [],
    });
    expect(updated.status).toBe(200);
    expect((await updated.json()).data).toMatchObject({ description: "Updated description", unitPrice: "30.00", categories: [] });

    expect((await request(path + "/status", "PATCH", firstToken, { status: "PUBLISHED" })).status).toBe(409);
    expect((await request(`/api/v1/admin/merchants/${merchant.id}/status`, "PATCH", token(admin), { status: "ACTIVE" })).status).toBe(200);
    expect((await request(path + "/status", "PATCH", firstToken, { status: "PUBLISHED" })).status).toBe(200);
    expect((await request(path + "/status", "PATCH", firstToken, { status: "DRAFT" })).status).toBe(200);
    const unavailable = await request(path + "/availability", "PATCH", firstToken, { isAvailable: false });
    expect((await unavailable.json()).data.isAvailable).toBe(false);
    expect((await request(path, "DELETE", firstToken)).status).toBe(204);
    expect((await request(path, "DELETE", firstToken)).status).toBe(204);
    expect((await request(path + "/status", "PATCH", firstToken, { status: "PUBLISHED" })).status).toBe(404);
    expect((await (await request(products, "GET", firstToken)).json()).data).toEqual([]);
    expect((await (await request(products + "?status=ARCHIVED", "GET", firstToken)).json()).data)
      .toMatchObject([{ id: product.id, status: "ARCHIVED" }]);
  });
});

describe("merchant onboarding HTTP API", () => {
  it("starts successfully and issues a token only for valid credentials", async () => {
    expect((await request("/health")).status).toBe(200);
    const path = "/api/v1/auth/login";
    const rejected = await request(path, "POST", undefined, { email: owner.email, password: "wrong" });
    expect(rejected.status).toBe(401);
    const result = await request(path, "POST", undefined, { email: owner.email, password });
    expect(result.status).toBe(200);
    const { data } = await result.json();
    expect((await request("/api/v1/merchant/profile", "GET", data.accessToken)).status).toBe(404);
  });

  it("isolates owner profiles, gates approval and availability, and replaces hours", async () => {
    const merchantToken = token(owner);
    const applications = "/api/v1/merchants";
    const merchant = "/api/v1/merchant";
    const profile = { name: "Test store", slug: `test-${randomUUID()}` };
    expect((await request(applications, "POST", undefined, profile)).status).toBe(401);
    expect((await request(applications, "POST", "invalid-token", profile)).status).toBe(401);
    expect((await request(applications, "POST", token(admin), profile)).status).toBe(403);

    const submitted = await request(applications, "POST", merchantToken, profile);
    expect(submitted.status).toBe(201);
    const { data: created } = await submitted.json();
    expect(created).toMatchObject({ ownerUserId: owner.id, status: "PENDING_APPROVAL", isPublic: false });
    expect((await request(applications, "POST", merchantToken, profile)).status).toBe(409);
    expect((await request(`${merchant}/profile`, "PATCH", token(peer), { name: "Other" })).status).toBe(404);
    expect((await request(`${merchant}/profile`, "PATCH", merchantToken, { ownerUserId: peer.id })).status).toBe(400);
    const edited = await request(`${merchant}/profile`, "PATCH", merchantToken, { city: "Accra" });
    expect(edited.status).toBe(200);
    expect((await edited.json()).data).toMatchObject({ city: "Accra", ownerUserId: owner.id });

    const availability = `${merchant}/status`;
    const approval = `/api/v1/admin/merchants/${created.id}/status`;
    expect((await request(availability, "PATCH", merchantToken, { acceptsOrders: true })).status).toBe(409);
    expect((await request(approval, "PATCH", merchantToken, { status: "ACTIVE" })).status).toBe(403);
    expect((await request(approval, "PATCH", token(admin), { status: "ACTIVE" })).status).toBe(200);
    expect((await request(availability, "PATCH", merchantToken, { acceptsOrders: true })).status).toBe(200);
    expect((await request(approval, "PATCH", token(admin), { status: "SUSPENDED" })).status).toBe(200);
    expect(await db.merchant.findUnique({ where: { id: created.id } }))
      .toMatchObject({ acceptsOrders: false, isPublic: false });
    expect(await db.auditLog.count({ where: { actorUserId: admin.id, entityId: created.id } })).toBe(2);

    const schedule = `${merchant}/hours`;
    const monday = { dayOfWeek: 1, opensAt: "08:30", closesAt: "17:00", isClosed: false };
    expect((await request(schedule, "PUT", merchantToken, { hours: [monday, monday] })).status).toBe(400);
    const hours = await request(schedule, "PUT", merchantToken, { hours: [monday] });
    expect(hours.status).toBe(200);
    expect((await hours.json()).data.operatingHours).toMatchObject([monday]);
    const cleared = await request(schedule, "PUT", merchantToken, { hours: [] });
    expect(cleared.status).toBe(200);
    expect((await cleared.json()).data.operatingHours).toEqual([]);
  });
});
