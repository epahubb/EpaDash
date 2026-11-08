import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { reserveInventory } from "../src/database/inventory.service.js";

const prisma = new PrismaClient();
let productId = "";
let merchantId = "";\nlet ownerId = "";
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

beforeAll(async () => {
  await prisma.$connect();
  const user = await prisma.user.create({ data: { email: `stock-${suffix}@example.test`, passwordHash: "x", firstName: "Stock", lastName: "Test" } });
  ownerId = user.id;
  const merchant = await prisma.merchant.create({ data: { ownerUserId: user.id, name: "Stock Merchant", slug: `stock-${suffix}` } });
  merchantId = merchant.id;
  const product = await prisma.product.create({ data: { merchantId: merchant.id, name: "Stock Item", slug: "stock-item", unitPrice: "2.00", inventory: { create: { quantityOnHand: 5, quantityReserved: 0 } } } });
  productId = product.id;

});

afterAll(async () => {
  if (productId) {
    const inventory = await prisma.inventory.findUnique({ where: { productId } });
    if (inventory) await prisma.inventoryMovement.deleteMany({ where: { inventoryId: inventory.id } });
    await prisma.product.delete({ where: { id: productId } }).catch(() => {});
  }
  if (merchantId) await prisma.merchant.delete({ where: { id: merchantId } }).catch(() => {});
  if (ownerId) await prisma.user.delete({ where: { id: ownerId } }).catch(() => {});
  await prisma.$disconnect();
});

describe("concurrent inventory reservations", () => {
  it("never reserves more stock than is available", async () => {
    const attempts = Array.from({ length: 10 }, (_, i) =>
      reserveInventory(prisma, { productId, quantity: 1, orderId: `order-${i}`, idempotencyKey: `reserve-${suffix}-${i}` })
        .then(() => true).catch(() => false)
    );
    const results = await Promise.all(attempts);
    const successes = results.filter(Boolean).length;
    const inventory = await prisma.inventory.findUniqueOrThrow({ where: { productId } });
    expect(successes).toBe(5);
    expect(inventory.quantityReserved).toBe(5);
    expect(inventory.quantityReserved).toBeLessThanOrEqual(inventory.quantityOnHand);
  });
});
