import { Prisma, PrismaClient } from "@prisma/client";

export async function assignRider(
  prisma: PrismaClient,
  input: { deliveryId: string; riderId: string; assignedByUserId?: string; reason?: string }
) {
  return prisma.$transaction(async (tx) => {
    const delivery = await tx.delivery.findUnique({ where: { id: input.deliveryId } });
    if (!delivery) throw new Error("Delivery not found.");
    if (["DELIVERED", "CANCELLED"].includes(delivery.status)) {
      throw new Error("A completed or cancelled delivery cannot be reassigned.");
    }
    const rider = await tx.riderProfile.findUnique({ where: { id: input.riderId } });
    if (!rider || !rider.isAvailable || rider.verificationStatus !== "VERIFIED") {
      throw new Error("Rider is not verified and available.");
    }
    const now = new Date();
    await tx.deliveryAssignment.updateMany({
      where: { deliveryId: input.deliveryId, status: "ACTIVE" },
      data: { status: "REVOKED", endedAt: now, reason: "Reassigned" }
    });
    const assignment = await tx.deliveryAssignment.create({
      data: {
        deliveryId: input.deliveryId, riderId: input.riderId,
        assignedByUserId: input.assignedByUserId, status: "ACTIVE",
        assignedAt: now, reason: input.reason
      }
    });
    await tx.delivery.update({
      where: { id: input.deliveryId },
      data: { riderId: input.riderId, assignedAt: now, status: "ASSIGNED" }
    });
    return assignment;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
