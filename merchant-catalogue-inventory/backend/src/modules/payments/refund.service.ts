import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Creates a partial or full refund request without allowing aggregate refunds
 * to exceed the captured payment amount. The unique idempotency key protects
 * repeated client/provider retries.
 */
export async function requestRefund(
  prisma: PrismaClient,
  input: { paymentId: string; amount: Prisma.Decimal | string; idempotencyKey: string; reason?: string }
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.refund.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return existing;

    const payment = await tx.payment.findUnique({ where: { id: input.paymentId } });
    if (!payment || payment.status !== "SUCCEEDED" && payment.status !== "PARTIALLY_REFUNDED") {
      throw new Error("Only a successful payment can be refunded.");
    }
    const amount = new Prisma.Decimal(input.amount);
    if (amount.lte(0)) throw new Error("Refund amount must be greater than zero.");

    const totals = await tx.refund.aggregate({
      where: { paymentId: payment.id, status: { in: ["REQUESTED", "PROCESSING", "SUCCEEDED"] } },
      _sum: { amount: true }
    });
    const alreadyCommitted = totals._sum.amount ?? new Prisma.Decimal(0);
    if (alreadyCommitted.plus(amount).gt(payment.amount)) {
      throw new Error("Total refunds cannot exceed the original payment amount.");
    }
    return tx.refund.create({
      data: {
        paymentId: payment.id, amount, currency: payment.currency,
        idempotencyKey: input.idempotencyKey, reason: input.reason,
        status: "REQUESTED"
      }
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
