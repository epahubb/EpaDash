import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let userId = "";
let merchantId = "";
let orderId = "";
let addressId = "";

beforeAll(async () => {
  await prisma.$connect();
  const user = await prisma.user.create({ data: { email: `snapshot-${suffix}@test.local`, passwordHash: "x", firstName: "Snapshot", lastName: "Test" } });
  userId = user.id;
  const merchantOwner = await prisma.user.create({ data: { email: `snapshot-owner-${suffix}@test.local`, passwordHash: "x", firstName: "Owner", lastName: "Test" } });
  const merchant = await prisma.merchant.create({ data: { ownerUserId: merchantOwner.id, name: "Snapshot Merchant", slug: `snapshot-${suffix}` } });
  merchantId = merchant.id;
  const customer = await prisma.customerProfile.create({ data: { userId } });
  const address = await prisma.address.create({ data: { userId, recipientName: "Original Recipient", phone: "0200000000", addressLine1: "Original Street", city: "Accra" } });
  addressId = address.id;
  const order = await prisma.order.create({ data: {
    orderNumber: `SNAP-${suffix}`, customerId: customer.id, merchantId,
    deliveryAddressId: address.id, deliveryRecipientName: address.recipientName,
    deliveryPhone: address.phone, deliveryAddressLine1: address.addressLine1,
    deliveryCity: address.city, subtotal: "5.00", grandTotal: "5.00"
  } });
  orderId = order.id;
  await prisma.address.update({ where: { id: address.id }, data: { recipientName: "Changed Recipient", addressLine1: "Changed Street" } });
});

afterAll(async () => {
  if (orderId) await prisma.order.delete({ where: { id: orderId } }).catch(() => {});
  if (addressId) await prisma.address.delete({ where: { id: addressId } }).catch(() => {});
  if (userId) {
    await prisma.customerProfile.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
  }
  if (merchantId) {
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (merchant) {
      await prisma.user.delete({ where: { id: merchant.ownerUserId } }).catch(() => {});
      await prisma.merchant.delete({ where: { id: merchantId } }).catch(() => {});
    }
  }
  await prisma.$disconnect();
});

describe("historical order address snapshots", () => {
  it("does not change when the customer's saved address is edited", async () => {
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    expect(order.deliveryRecipientName).toBe("Original Recipient");
    expect(order.deliveryAddressLine1).toBe("Original Street");
    const savedAddress = await prisma.address.findUniqueOrThrow({ where: { id: addressId } });
    expect(savedAddress.recipientName).toBe("Changed Recipient");
    await expect(prisma.order.update({
      where: { id: orderId }, data: { deliveryRecipientName: "Tampered Recipient" }
    })).rejects.toBeTruthy();
  });
});
