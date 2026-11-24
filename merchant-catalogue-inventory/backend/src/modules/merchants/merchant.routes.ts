import { Prisma, type PrismaClient } from "@prisma/client";
import { Router, type RequestHandler } from "express";
import { HttpError } from "../../common/http-error.js";
import {
  merchantApplication,
  merchantAvailability,
  merchantHours,
  merchantProfileUpdate,
} from "./merchant.schemas.js";

const profile = {
  include: { operatingHours: { orderBy: { dayOfWeek: "asc" } } },
} satisfies Prisma.MerchantDefaultArgs;

export function createMerchantApplication(db: PrismaClient): RequestHandler {
  return async (req, res) => {
    const data = merchantApplication.parse(req.body);
    const merchant = await db.merchant.create({
      data: { ...data, ownerUserId: res.locals.actor.id },
      ...profile,
    });
    res.status(201).json({ data: merchant });
  };
}

export function createMerchantRouter(db: PrismaClient): Router {
  const router = Router();

  router.get("/profile", async (_req, res) => {
    const merchant = await db.merchant.findUniqueOrThrow({
      where: { ownerUserId: res.locals.actor.id },
      ...profile,
    });
    res.json({ data: merchant });
  });

  router.patch("/profile", async (req, res) => {
    const data = merchantProfileUpdate.parse(req.body);
    const merchant = await db.merchant.update({
      where: { ownerUserId: res.locals.actor.id },
      data,
      ...profile,
    });
    res.json({ data: merchant });
  });

  router.put("/hours", async (req, res) => {
    const { hours } = merchantHours.parse(req.body);
    const merchant = await db.$transaction(async (tx) => {
      // Lock the merchant row before replacing its hours so concurrent writes serialize.
      const { id } = await tx.merchant.update({
        where: { ownerUserId: res.locals.actor.id },
        data: { updatedAt: new Date() },
        select: { id: true },
      });
      await tx.merchantOperatingHour.deleteMany({ where: { merchantId: id } });
      if (hours.length) {
        await tx.merchantOperatingHour.createMany({
          data: hours.map((entry) => ({ ...entry, merchantId: id })),
        });
      }
      return tx.merchant.findUniqueOrThrow({ where: { id }, ...profile });
    });
    res.json({ data: merchant });
  });

  router.patch("/status", async (req, res) => {
    const { acceptsOrders } = merchantAvailability.parse(req.body);
    const ownerUserId = res.locals.actor.id;
    await db.merchant.findUniqueOrThrow({ where: { ownerUserId }, select: { id: true } });
    try {
      const updated = await db.merchant.update({
        where: { ownerUserId, ...(acceptsOrders && { status: "ACTIVE" }) },
        data: { acceptsOrders },
        ...profile,
      });
      res.json({ data: updated });
    } catch (error) {
      if (acceptsOrders && error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new HttpError(409, "MERCHANT_NOT_ACTIVE", "Only active merchants can accept orders.");
      }
      throw error;
    }
  });

  return router;
}
