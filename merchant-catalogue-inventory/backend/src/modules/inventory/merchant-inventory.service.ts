import { createHash, randomUUID } from "node:crypto";
import type { Inventory, PrismaClient } from "@prisma/client";
import { HttpError } from "../../common/http-error.js";

export const maxStockQuantity = 2_147_483_647;

type InventoryChange =
  | { kind: "set"; quantityOnHand: number; lowStockLevel?: number }
  | { kind: "adjustment"; quantityDelta: number; note?: string };

export function stockSnapshot(productId: string, inventory: Inventory | null) {
  const quantityOnHand = inventory?.quantityOnHand ?? 0;
  const quantityReserved = inventory?.quantityReserved ?? 0;
  return {
    productId,
    quantityOnHand,
    quantityReserved,
    availableQuantity: quantityOnHand - quantityReserved,
    lowStockLevel: inventory?.lowStockLevel ?? 0,
    updatedAt: inventory?.updatedAt.toISOString() ?? null,
  };
}

export async function changeMerchantStock(
  db: PrismaClient,
  input: { ownerUserId: string; productId: string; key: string; change: InventoryChange },
) {
  const { ownerUserId, productId, key, change } = input;
  const fingerprint = createHash("sha256").update(JSON.stringify(change)).digest("hex");

  return db.$transaction(async (tx) => {
    // Keep product archival and stock writes ordered. Only lock the product,
    // so stock writes on distinct products can proceed independently.
    const [product] = await tx.$queryRaw<Array<{ status: string }>>`
      SELECT p."status"
      FROM "Product" p JOIN "Merchant" m ON m."id" = p."merchantId"
      WHERE p."id" = ${productId}::uuid AND m."ownerUserId" = ${ownerUserId}::uuid
      FOR SHARE OF p
    `;
    if (!product) throw new HttpError(404, "NOT_FOUND", "The requested product was not found.");

    if (product.status !== "ARCHIVED") {
      // Older products may have no inventory row. This insert is safe if two
      // requests initialize it simultaneously.
      await tx.inventory.createMany({ data: { productId }, skipDuplicates: true });
    }
    const [current] = await tx.$queryRaw<Inventory[]>`
      SELECT * FROM "Inventory" WHERE "productId" = ${productId}::uuid FOR UPDATE
    `;

    if (current) {
      const previous = await tx.inventoryMutation.findUnique({
        where: { inventoryId_key: { inventoryId: current.id, key } },
      });
      if (previous) {
        if (previous.fingerprint !== fingerprint) {
          throw new HttpError(409, "IDEMPOTENCY_CONFLICT", "This key was already used for a different stock update.");
        }
        return previous.response;
      }
    }
    if (!current || product.status === "ARCHIVED") {
      throw new HttpError(404, "NOT_FOUND", "The requested editable product was not found.");
    }

    const quantityOnHand = change.kind === "set"
      ? change.quantityOnHand : current.quantityOnHand + change.quantityDelta;
    if (quantityOnHand < current.quantityReserved || quantityOnHand > maxStockQuantity) {
      throw new HttpError(409, "INVALID_STOCK_LEVEL", "Stock must cover reserved units and stay within the supported range.");
    }
    const quantityDelta = quantityOnHand - current.quantityOnHand;
    const lowStockLevel = change.kind === "set" ? change.lowStockLevel ?? current.lowStockLevel : current.lowStockLevel;
    const updated = quantityDelta !== 0 || lowStockLevel !== current.lowStockLevel
      ? await tx.inventory.update({ where: { id: current.id }, data: { quantityOnHand, lowStockLevel } })
      : current;

    const movement = quantityDelta === 0 ? null : await tx.inventoryMovement.create({
      data: {
        inventoryId: current.id,
        movementType: "ADJUSTMENT",
        quantityDelta,
        referenceType: "MERCHANT",
        referenceId: ownerUserId,
        idempotencyKey: randomUUID(),
        note: change.kind === "adjustment" ? change.note : undefined,
      },
      select: { id: true },
    });

    const response = { ...stockSnapshot(productId, updated), movementId: movement?.id ?? null };
    await tx.inventoryMutation.create({
      data: { inventoryId: current.id, key, fingerprint, response },
    });
    return response;
  });
}
