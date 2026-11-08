import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient, Role } from "@prisma/client";
import { assignRider } from "../src/database/delivery-assignment.service.js";

const prisma = new PrismaClient();
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let deliveryId = "";\nlet orderId = "";\nlet merchantId = "";\nlet merchantUserId = "";\nlet customerUserId = "";\nlet addressId = "";\nlet riderUserIds: string[] = [];
let riderOneId = "";
let riderTwoId = "";

beforeAll(async () => {
  await prisma.$connect();
  const merchantUser = await prisma.user.create({ data: { email: `m-${suffix}@test.local`, passwordHash: "x", firstName: "M", lastName: "Test", roles: { create: { role: Role.MERCHANT } } } });
  merchantUserId = merchantUser.id;
  const merchant = await prisma.merchant.create({ data: { ownerUserId: merchantUser.id, name: "Assignment Merchant", slug: `assign-${suffix}` } });
  merchantId = merchant.id;
  const customerUser = await prisma.user.create({ data: { email: `c-${suffix}@test.local`, passwordHash: "x", firstName: "C", lastName: "Test" } });
  customerUserId = customerUser.id;
  const customer = await prisma.customerProfile.create({ data: { userId: customerUser.id } });
  const riderUsers = await Promise.all([1,2].map(n => prisma.user.create({ data: { email: `r${n}-${suffix}@test.local`, passwordHash: "x", firstName: "R", lastName: "Test", roles: { create: { role: Role.RIDER } } } })));
  riderUserIds = riderUsers.map(u => u.id);
  const riders = await Promise.all(riderUsers.map(u => prisma.riderProfile.create({ data: { userId: u.id, verificationStatus: "VERIFIED", isAvailable: true } })));
  riderOneId = riders[0].id; riderTwoId = riders[1].id;
  const address = await prisma.address.create({ data: { userId: customerUser.id, recipientName: "Test", phone: "000", addressLine1: "Test Road", city: "Accra" } });
  addressId = address.id;
  const order = await prisma.order.create({ data: {
    orderNumber: `ORDER-${suffix}`, customerId: customer.id, merchantId: merchant.id,
    deliveryAddressId: address.id, deliveryRecipientName: address.recipientName,
    deliveryPhone: address.phone, deliveryAddressLine1: address.addressLine1,
    deliveryCity: address.city, subtotal: "10.00", grandTotal: "10.00"
  } });
  orderId = order.id;
  const delivery = await prisma.delivery.create({ data: { orderId: order.id } });
  deliveryId = delivery.id;
});

afterAll(async () => {
  if (deliveryId) {
    await prisma.deliveryAssignment.deleteMany({ where: { deliveryId } });
    await prisma.delivery.deleteMany({ where: { id: deliveryId } });
  }
  if (orderId) await prisma.order.delete({ where: { id: orderId } }).catch(() => {});
  if (addressId) await prisma.address.delete({ where: { id: addressId } }).catch(() => {});
  if (customerUserId) await prisma.customerProfile.deleteMany({ where: { userId: customerUserId } });
  if (riderUserIds.length) await prisma.riderProfile.deleteMany({ where: { userId: { in: riderUserIds } } });
  if (merchantId) await prisma.merchant.delete({ where: { id: merchantId } }).catch(() => {});
  const userIds = [merchantUserId, customerUserId, ...riderUserIds].filter(Boolean);
  if (userIds.length) await prisma.userRole.deleteMany({ where: { userId: { in: userIds } } });
  if (merchantUserId) await prisma.user.delete({ where: { id: merchantUserId } }).catch(() => {});
  if (customerUserId) await prisma.user.delete({ where: { id: customerUserId } }).catch(() => {});
  for (const id of riderUserIds) await prisma.user.delete({ where: { id } }).catch(() => {});
  await prisma.$disconnect();
});

describe("delivery assignment history", () => {
  it("preserves the previous rider when reassigned", async () => {
    await assignRider(prisma, { deliveryId, riderId: riderOneId });
    await assignRider(prisma, { deliveryId, riderId: riderTwoId, reason: "Rider unavailable" });
    const history = await prisma.deliveryAssignment.findMany({ where: { deliveryId }, orderBy: { assignedAt: "asc" } });
    expect(history).toHaveLength(2);
    expect(history[0].status).toBe("REVOKED");
    expect(history[0].endedAt).not.toBeNull();
    expect(history[1].status).toBe("ACTIVE");
    expect(history[1].riderId).toBe(riderTwoId);
  });
});
