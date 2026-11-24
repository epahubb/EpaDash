import { Prisma, type PrismaClient } from "@prisma/client";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "./common/http-error.js";
import { authenticate, requireRole } from "./middleware/authenticate.js";
import { createMerchantVerificationRouter } from "./modules/admin/merchant-verification.routes.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createMerchantInventoryRouter } from "./modules/inventory/merchant-inventory.routes.js";
import { createMerchantApplication, createMerchantRouter } from "./modules/merchants/merchant.routes.js";
import { createProductCategoryAdminRouter, listProductCategories } from "./modules/products/product-category.routes.js";
import { createProductRouter } from "./modules/products/product.routes.js";
import type { ProductImageStorage } from "./modules/products/image-storage.js";
import { createProductImageRouter, createProductImageUpload } from "./modules/products/product-image.routes.js";

const handleError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: { code: error.code, message: error.message } });
  } else if (error instanceof ZodError) {
    res.status(400).json({ error: {
      code: "VALIDATION_ERROR",
      message: "Check the supplied request fields.",
      details: error.issues.map(({ path, message }) => ({ path, message })),
    } });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({ error: { code: "CONFLICT", message: "A record with those details already exists." } });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "The requested resource was not found." } });
  } else if (error?.type === "entity.parse.failed") {
    res.status(400).json({ error: { code: "INVALID_JSON", message: "Send a valid JSON body." } });
  } else if (error?.type === "entity.too.large") {
    res.status(413).json({ error: { code: "BODY_TOO_LARGE", message: "The request body is too large." } });
  } else {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." } });
  }
};

export function createApp(db: PrismaClient, secret: string, imageStorage?: ProductImageStorage) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "128kb" }));
  const access = authenticate(db, secret);

  app.get("/health", (_req, res) => { res.json({ status: "ok" }); });
  app.use("/api/v1/auth", createAuthRouter(db, secret));
  app.post("/api/v1/merchants", access, requireRole("MERCHANT"), createMerchantApplication(db));
  app.post("/api/v1/uploads/presign", access, requireRole("MERCHANT"), createProductImageUpload(db, imageStorage));
  app.use("/api/v1/products/:productId/images", createProductImageRouter(db, imageStorage, true));
  const merchant = express.Router();
  merchant.use("/products/:productId/images", createProductImageRouter(db, imageStorage, false));
  merchant.use("/products/:productId/inventory", createMerchantInventoryRouter(db));
  merchant.use("/products", createProductRouter(db));
  merchant.get("/product-categories", listProductCategories(db));
  merchant.use(createMerchantRouter(db));
  app.use("/api/v1/merchant", access, requireRole("MERCHANT"), merchant);
  app.use("/api/v1/admin/merchants", access, requireRole("ADMIN"), createMerchantVerificationRouter(db));
  app.use("/api/v1/admin/product-categories", access, requireRole("ADMIN"), createProductCategoryAdminRouter(db));
  app.use((_req, _res, next) => {
    next(new HttpError(404, "NOT_FOUND", "The requested resource was not found."));
  });
  app.use(handleError);
  return app;
}
