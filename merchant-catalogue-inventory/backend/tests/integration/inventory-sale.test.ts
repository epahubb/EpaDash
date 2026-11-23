import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { reserveInventory, commitInventorySale } from "../../src/modules/inventory/inventory.service.js";

const prisma = new PrismaClient();
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

let productId = "";
let merchantId = "";
let ownerId = "";

beforeAll(async () => {
  await prisma.$connect();

  const user = await prisma.user.create({
    data: {
      email: `sale-${suffix}@example.test`,
      passwordHash: "x",
      firstName: "Sale",
      lastName: "Test"
    }
  });
  ownerId = user.id;

  const merchant = await prisma.merchant.create({
    data: {
      ownerUserId: user.id,
      name: "Sale Test Merchant",
      slug: `sale-${suffix}`
    }
  });
  merchantId = merchant.id;

  const product = await prisma.product.create({
    data: {
      merchantId: merchant.id,
      name: "Sale Test Product",
      slug: `sale-product-${suffix}`,
      unitPrice: "2.00",
      inventory: {
        create: {
          quantityOnHand: 5,
          quantityReserved: 0
        }
      }
    }
  });
  productId = product.id;
});

afterAll(async () => {
  if (productId) {
    const inventory = await prisma.inventory.findUnique({
      where: { productId }
    });
    if (inventory) {
      await prisma.inventoryMovement.deleteMany({
        where: { inventoryId: inventory.id }
      });
    }
    await prisma.product.delete({ where: { id: productId } }).catch(() => {});
  }

  if (merchantId) {
    await prisma.merchant.delete({ where: { id: merchantId } }).catch(() => {});
  }

  if (ownerId) {
    await prisma.user.delete({ where: { id: ownerId } }).catch(() => {});
  }

  await prisma.$disconnect();
});

describe("inventory sale integrity", () => {
  it("rejects zero, negative and decimal sale quantities", async () => {
    for (const quantity of [0, -1, 1.5]) {
      await expect(
        commitInventorySale(prisma, {
          productId,
          quantity,
          orderId: `invalid-${quantity}`,
          idempotencyKey: `invalid-sale-${suffix}-${quantity}`
        })
      ).rejects.toThrow(/positive integer/i);
    }

    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: { productId }
    });

    expect(inventory.quantityOnHand).toBe(5);
    expect(inventory.quantityReserved).toBe(0);
  });

  it("commits a reservation exactly once", async () => {
    await reserveInventory(prisma, {
      productId,
      quantity: 2,
      orderId: `sale-order-${suffix}`,
      idempotencyKey: `sale-reserve-${suffix}`
    });

    const input = {
      productId,
      quantity: 1,
      orderId: `sale-order-${suffix}`,
      idempotencyKey: `sale-commit-${suffix}`
    };

    await commitInventorySale(prisma, input);
    await commitInventorySale(prisma, input);

    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: { productId }
    });

    expect(inventory.quantityOnHand).toBe(4);
    expect(inventory.quantityReserved).toBe(1);

    const sales = await prisma.inventoryMovement.count({
      where: {
        idempotencyKey: input.idempotencyKey,
        movementType: "SALE"
      }
    });

    expect(sales).toBe(1);
  });
});
