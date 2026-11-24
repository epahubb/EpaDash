import type { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { changeMerchantStock, maxStockQuantity, stockSnapshot } from "./merchant-inventory.service.js";

const productParams = z.object({ productId: z.string().uuid().transform((id) => id.toLowerCase()) });
const idempotencyKey = z.string().regex(/^[A-Za-z0-9._:-]{1,128}$/);
const quantity = z.number().int().min(0).max(maxStockQuantity);
const stockLevel = z.object({ quantityOnHand: quantity, lowStockLevel: quantity.optional() }).strict();
const adjustment = z.object({
  quantityDelta: z.number().int().min(-maxStockQuantity).max(maxStockQuantity).refine((value) => value !== 0),
  note: z.string().trim().min(1).max(500).optional(),
}).strict();
const pagination = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export function createMerchantInventoryRouter(db: PrismaClient): Router {
  const router = Router({ mergeParams: true });

  router.get("/", async (req, res) => {
    const { productId: id } = productParams.parse(req.params);
    const { inventory } = await db.product.findUniqueOrThrow({
      where: { id, merchant: { ownerUserId: res.locals.actor.id } },
      select: { inventory: true },
    });
    res.json({ data: stockSnapshot(id, inventory) });
  });

  router.put("/", async (req, res) => {
    const { productId } = productParams.parse(req.params);
    const key = idempotencyKey.parse(req.get("Idempotency-Key"));
    const fields = stockLevel.parse(req.body);
    const data = await changeMerchantStock(db, {
      productId, key, ownerUserId: res.locals.actor.id, change: { kind: "set", ...fields },
    });
    res.json({ data });
  });

  router.post("/adjustments", async (req, res) => {
    const { productId } = productParams.parse(req.params);
    const key = idempotencyKey.parse(req.get("Idempotency-Key"));
    const fields = adjustment.parse(req.body);
    const data = await changeMerchantStock(db, {
      productId, key, ownerUserId: res.locals.actor.id, change: { kind: "adjustment", ...fields },
    });
    res.json({ data });
  });

  router.get("/movements", async (req, res) => {
    const { productId: id } = productParams.parse(req.params);
    const { page, limit } = pagination.parse(req.query);
    const { inventory } = await db.product.findUniqueOrThrow({
      where: { id, merchant: { ownerUserId: res.locals.actor.id } },
      select: { inventory: { select: { id: true } } },
    });
    if (!inventory) {
      res.json({ data: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } });
      return;
    }
    const where = { inventoryId: inventory.id };
    const [data, totalItems] = await db.$transaction([
      db.inventoryMovement.findMany({
        where, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * limit, take: limit,
        select: {
          id: true, movementType: true, quantityDelta: true, reservedDelta: true, note: true, createdAt: true,
        },
      }),
      db.inventoryMovement.count({ where }),
    ], { isolationLevel: "RepeatableRead" });
    res.json({ data, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } });
  });

  return router;
}
