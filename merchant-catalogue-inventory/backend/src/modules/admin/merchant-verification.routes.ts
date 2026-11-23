import type { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { merchantVerification } from "../merchants/merchant.schemas.js";

export function createMerchantVerificationRouter(db: PrismaClient): Router {
  const router = Router();
  router.patch("/:merchantId/status", async (req, res) => {
    const id = z.string().uuid().parse(req.params.merchantId);
    const { status } = merchantVerification.parse(req.body);
    const updated = await db.$transaction(async (tx) => {
      const merchant = await tx.merchant.update({
        where: { id, status: { not: "CLOSED" } },
        data: {
          status,
          isPublic: status === "ACTIVE",
          ...(status === "SUSPENDED" && { acceptsOrders: false }),
        },
      });
      await tx.auditLog.create({
        data: {
          actorUserId: res.locals.actor.id,
          action: "MERCHANT_STATUS_UPDATED",
          entityType: "Merchant",
          entityId: id,
          metadata: { status },
        },
      });
      return merchant;
    });
    res.json({ data: updated });
  });
  return router;
}
