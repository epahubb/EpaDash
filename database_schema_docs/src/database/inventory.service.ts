import { Prisma, PrismaClient } from "@prisma/client";



/**
 * Atomically reserves stock. The conditional UPDATE is the concurrency guard:
 * concurrent requests cannot reserve more than quantityOnHand.
 */
export async function reserveInventory(
  db: PrismaClient,
  input: { productId: string; quantity: number; orderId: string; idempotencyKey: string }
): Promise<void> {
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new Error("Quantity must be a positive integer.");

  await db.$transaction(async (tx) => {
    const previous = await tx.inventoryMovement.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (previous) return;

    const inventory = await tx.inventory.findUnique({ where: { productId: input.productId } });
    if (!inventory) throw new Error("Inventory record not found.");

    const updated = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "quantityReserved" = "quantityReserved" + ${input.quantity},
          "updatedAt" = NOW()
      WHERE "productId" = ${input.productId}::uuid
        AND ("quantityOnHand" - "quantityReserved") >= ${input.quantity}
    `;
    if (updated !== 1) throw new Error("Insufficient available inventory.");

    await tx.inventoryMovement.create({
      data: {
        inventoryId: inventory.id, movementType: "RESERVATION",
        quantityDelta: 0, reservedDelta: input.quantity,
        referenceType: "ORDER", referenceId: input.orderId,
        idempotencyKey: input.idempotencyKey, note: "Order stock reservation"
      }
    });
  });
}

/** Converts a prior reservation into a sale after payment/order confirmation. */
export async function commitInventorySale(
  db: PrismaClient,
  input: { productId: string; quantity: number; orderId: string; idempotencyKey: string }
): Promise<void> {
  await db.$transaction(async (tx) => {
    if (await tx.inventoryMovement.findUnique({ where: { idempotencyKey: input.idempotencyKey } })) return;
    const inventory = await tx.inventory.findUnique({ where: { productId: input.productId } });
    if (!inventory) throw new Error("Inventory record not found.");
    const changed = await tx.$executeRaw`
      UPDATE "Inventory"
      SET "quantityOnHand" = "quantityOnHand" - ${input.quantity},
          "quantityReserved" = "quantityReserved" - ${input.quantity},
          "updatedAt" = NOW()
      WHERE "productId" = ${input.productId}::uuid
        AND "quantityReserved" >= ${input.quantity}
        AND "quantityOnHand" >= ${input.quantity}
    `;
    if (changed !== 1) throw new Error("No matching stock reservation exists.");
    await tx.inventoryMovement.create({
      data: {
        inventoryId: inventory.id, movementType: "SALE",
        quantityDelta: -input.quantity, reservedDelta: -input.quantity,
        referenceType: "ORDER", referenceId: input.orderId,
        idempotencyKey: input.idempotencyKey, note: "Reserved stock committed as sale"
      }
    });
  });
}
