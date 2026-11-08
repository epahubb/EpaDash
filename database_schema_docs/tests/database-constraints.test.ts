import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

beforeAll(async () => { await prisma.$connect(); });
afterAll(async () => { await prisma.$disconnect(); });

describe("PostgreSQL integrity constraints", () => {
  it("enforces unique user email", async () => {
    const data = { email: `unique-${suffix}@example.test`, passwordHash: "test-hash", firstName: "Test", lastName: "User" };
    const first = await prisma.user.create({ data });
    await expect(prisma.user.create({ data })).rejects.toMatchObject({ code: "P2002" });
    await prisma.user.delete({ where: { id: first.id } });
  });

  it("rejects negative inventory and reserved stock greater than on-hand", async () => {
    const owner = await prisma.user.create({ data: { email: `owner-${suffix}@example.test`, passwordHash: "x", firstName: "Owner", lastName: "Test", roles: { create: { role: Role.MERCHANT } } } });
    const merchant = await prisma.merchant.create({ data: { ownerUserId: owner.id, name: "Constraint Merchant", slug: `constraint-${suffix}` } });
    const product = await prisma.product.create({ data: { merchantId: merchant.id, name: "Constraint Product", slug: "constraint-product", unitPrice: "1.00", inventory: { create: { quantityOnHand: 2, quantityReserved: 0 } } } });
    await expect(prisma.inventory.update({ where: { productId: product.id }, data: { quantityOnHand: -1 } })).rejects.toBeTruthy();
    await expect(prisma.inventory.update({ where: { productId: product.id }, data: { quantityReserved: 3 } })).rejects.toBeTruthy();
    await prisma.product.delete({ where: { id: product.id } });
    await prisma.merchant.delete({ where: { id: merchant.id } });
    await prisma.user.delete({ where: { id: owner.id } });
  });
});
