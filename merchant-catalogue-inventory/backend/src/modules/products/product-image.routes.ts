import { randomUUID } from "node:crypto";
import type { PrismaClient, ProductImage } from "@prisma/client";
import { Router, type RequestHandler } from "express";
import { z } from "zod";
import { HttpError } from "../../common/http-error.js";
import {
  maxProductImageBytes, minProductImageBytes, productImageTypes,
  readUrlLifetimeSeconds, uploadUrlLifetimeSeconds,
  type ProductImageObject, type ProductImageStorage,
} from "./image-storage.js";

const productId = z.string().uuid().transform((id) => id.toLowerCase());
const contentType = z.enum(productImageTypes);
const upload = z.object({
  productId,
  contentType,
  sizeBytes: z.number().int().min(minProductImageBytes).max(maxProductImageBytes),
  checksumSha256: z.string().refine((value) => (
    /^[A-Za-z0-9+/]{43}=$/.test(value) && Buffer.from(value, "base64").toString("base64") === value
  ), "Provide a base64-encoded SHA-256 checksum."),
}).strict();
const productPath = z.object({ productId });
const imagePath = productPath.extend({ imageId: z.string().uuid() });
const completionWindowMs = 10 * 60 * 1000;
const maxImagesPerProduct = 20;
const publicProduct = {
  status: "PUBLISHED", isAvailable: true, merchant: { status: "ACTIVE", isPublic: true },
} as const;

function requireStorage(storage: ProductImageStorage | undefined): ProductImageStorage {
  if (!storage) {
    throw new HttpError(503, "IMAGE_STORAGE_UNAVAILABLE", "Product image storage is not configured.");
  }
  return storage;
}

function imageObject({ objectKey, contentType: type, sizeBytes, checksumSha256 }: ProductImage): ProductImageObject {
  return { objectKey, contentType: contentType.parse(type), sizeBytes, checksumSha256 };
}

const imageMetadata = { id: true, contentType: true, sizeBytes: true, readyAt: true } as const;

export function createProductImageUpload(db: PrismaClient, storage?: ProductImageStorage): RequestHandler {
  return async (req, res) => {
    const { productId: id, ...image } = upload.parse(req.body);
    const ownerUserId = res.locals.actor.id;
    const imageId = randomUUID();
    const object = { ...image, objectKey: `product-images/${id}/${imageId}` };

    const { url, headers } = await db.$transaction(async (tx) => {
      const [product] = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT p."id" FROM "Product" p JOIN "Merchant" m ON p."merchantId" = m."id"
        WHERE p."id" = ${id}::uuid AND m."ownerUserId" = ${ownerUserId}::uuid AND p."status" <> 'ARCHIVED'
        FOR UPDATE OF p
      `;
      if (!product) throw new HttpError(404, "NOT_FOUND", "The requested editable product was not found.");
      const now = new Date();
      const used = await tx.productImage.count({
        where: { productId: id, OR: [{ readyAt: { not: null } }, { expiresAt: { gt: now } }] },
      });
      if (used >= maxImagesPerProduct) {
        throw new HttpError(409, "PRODUCT_IMAGE_LIMIT", "The product already has the maximum number of images or active uploads.");
      }
      const signed = await requireStorage(storage).presignUpload(object);
      await tx.productImage.create({
        data: { id: imageId, productId: id, ...object, expiresAt: new Date(now.getTime() + completionWindowMs) },
      });
      return signed;
    });

    res.set("Cache-Control", "no-store").status(201).json({
      data: { imageId, method: "PUT", url, headers, expiresIn: uploadUrlLifetimeSeconds },
    });
  };
}

export function createProductImageRouter(db: PrismaClient, storage: ProductImageStorage | undefined, publicAccess: boolean): Router {
  const router = Router({ mergeParams: true });

  router.get("/", async (req, res) => {
    const { productId: id } = productPath.parse(req.params);
    const where = publicAccess ? publicProduct : { merchant: { ownerUserId: res.locals.actor.id } };
    const { images } = await db.product.findUniqueOrThrow({
      where: { id, ...where },
      select: { images: {
        where: { readyAt: { not: null } }, select: imageMetadata,
        orderBy: [{ readyAt: "asc" }, { id: "asc" }],
      } },
    });
    res.set("Cache-Control", "no-store").json({ data: images });
  });

  router.get("/:imageId", async (req, res) => {
    const { productId: id, imageId } = imagePath.parse(req.params);
    const product = publicAccess ? publicProduct : { merchant: { ownerUserId: res.locals.actor.id } };
    const image = await db.productImage.findUniqueOrThrow({
      where: { id: imageId, productId: id, product, readyAt: { not: null } },
    });
    const url = await requireStorage(storage).presignRead(imageObject(image));
    res.set("Cache-Control", "no-store").json({ data: { url, expiresIn: readUrlLifetimeSeconds } });
  });

  if (!publicAccess) {
    router.post("/:imageId/complete", async (req, res) => {
      const { productId: id, imageId } = imagePath.parse(req.params);
      const where = {
        id: imageId,
        productId: id,
        product: { merchant: { ownerUserId: res.locals.actor.id }, status: { not: "ARCHIVED" as const } },
      };
      const image = await db.productImage.findUniqueOrThrow({ where });
      if (!image.readyAt) {
        if (image.expiresAt <= new Date()) {
          throw new HttpError(410, "PRODUCT_IMAGE_UPLOAD_EXPIRED", "The image upload expired. Request a new upload URL.");
        }
        if (!await requireStorage(storage).verifyUpload(imageObject(image))) {
          throw new HttpError(409, "INVALID_PRODUCT_IMAGE", "No upload matches the expected size, checksum and image type.");
        }
        const now = new Date();
        const result = await db.productImage.updateMany({
          where: { ...where, readyAt: null, expiresAt: { gt: now } }, data: { readyAt: now },
        });
        if (!result.count) {
          const current = await db.productImage.findUniqueOrThrow({ where });
          if (!current.readyAt) {
            throw new HttpError(410, "PRODUCT_IMAGE_UPLOAD_EXPIRED", "The image upload expired. Request a new upload URL.");
          }
        }
      }
      const data = await db.productImage.findUniqueOrThrow({ where, select: imageMetadata });
      res.json({ data });
    });
  }

  return router;
}
