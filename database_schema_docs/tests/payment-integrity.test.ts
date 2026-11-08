import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient, Role } from "@prisma/client";
import { requestRefund } from "../src/database/refund.service.js";

const prisma = new PrismaClient();
const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let paymentId = "";
let orderId = "";
let customerUserId = "";
let merchantId = "";

beforeAll(async () => {
  await prisma.$connect();
  const customerUser = await prisma.user.create({ data: { email: `pay-c-${suffix}@test.local`, passwordHash: "x", firstName: "Pay", lastName: "Customer", roles: { create: { role: Role.CUSTOMER } } } });
  customerUserId = customerUser.id;
  const merchantUser = await prisma.user.create({ data: { email: `pay-m-${suffix}@test.local`, passwordHash: "x", firstName: "Pay", lastName: "Merchant", roles: { create: { role: Role.MERCHANT } } } });
  const merchant = await prisma.merchant.create({ data: { ownerUserId: merchantUser.id, name: "Payment Merchant", slug: `pay-${suffix}` } });
  merchantId = merchant.id;
  const customer = await prisma.customerProfile.create({ data: { userId: customerUser.id } });
  const order = await prisma.order.create({ data: {
    orderNumber: `PAY-${suffix}`, customerId: customer.id, merchantId,
    deliveryRecipientName: "Test", deliveryPhone: "000", deliveryAddressLine1: "Test",
    deliveryCity: "Accra", subtotal: "50.00", grandTotal: "50.00"
  } });
  orderId = order.id;
  const payment = await prisma.payment.create({ data: {
    orderId, provider: "MANUAL", amount: "50.00", currency: "GHS",
    status: "SUCCEEDED", idempotencyKey: `pay-${suffix}`
  } });
  paymentId = payment.id;
});

afterAll(async () => {
  if (paymentId) await prisma.refund.deleteMany({ where: { paymentId } });
  if (orderId) {
    await prisma.payment.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } }).catch(() => {});
  }
  if (customerUserId) {
    await prisma.customerProfile.deleteMany({ where: { userId: customerUserId } });
    await prisma.user.delete({ where: { id: customerUserId } }).catch(() => {});
  }
  if (merchantId) {
    const merchant = await prisma.merchant.findUnique({ where: { id: merchantId } });
    if (merchant) {
      await prisma.merchant.delete({ where: { id: merchantId } }).catch(() => {});
      await prisma.user.delete({ where: { id: merchant.ownerUserId } }).catch(() => {});
    }
  }
  await prisma.$disconnect();
});

describe("payment and refund integrity", () => {
  it("rejects refund totals above the captured payment amount", async () => {
    await requestRefund(prisma, { paymentId, amount: "30.00", idempotencyKey: `refund-a-${suffix}` });
    await expect(requestRefund(prisma, { paymentId, amount: "25.00", idempotencyKey: `refund-b-${suffix}` }))
      .rejects.toThrow(/cannot exceed/i);
  });

  it("rejects a provider event whose provider does not match the payment provider", async () => {
    await expect(prisma.paymentTransaction.create({
      data: {
        paymentId, provider: "PROVIDER_A", providerEventId: `mismatch-${suffix}`,
        eventType: "payment.confirmed", verified: true
      }
    })).rejects.toBeTruthy();
  });

  it("is idempotent for a repeated refund request key", async () => {
    const first = await requestRefund(prisma, { paymentId, amount: "5.00", idempotencyKey: `refund-idem-${suffix}` });
    const second = await requestRefund(prisma, { paymentId, amount: "5.00", idempotencyKey: `refund-idem-${suffix}` });
    expect(first.id).toBe(second.id);
  });
});
