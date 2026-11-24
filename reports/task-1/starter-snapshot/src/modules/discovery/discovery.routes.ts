import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { DiscoveryRepository } from "./discovery.repository";
import { DiscoveryService } from "./discovery.service";
import { listQuerySchema, merchantSlugSchema, productIdSchema, productListQuerySchema } from "./discovery.schemas";

export function createDiscoveryRouter(prisma: PrismaClient) {
  const router = Router();
  const service = new DiscoveryService(new DiscoveryRepository(prisma));

  router.get("/merchants", async (req, res, next) => {
    try {
      const parsed = listQuerySchema.safeParse(req.query);
      if (!parsed.success) return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid query parameters.", details: parsed.error.issues },
      });
      const result = await service.listMerchants(parsed.data);
      return res.json({ data: result.data, pagination: result.pagination });
    } catch (error) { return next(error); }
  });

  router.get("/merchants/:slug", async (req, res, next) => {
    try {
      const params = merchantSlugSchema.safeParse(req.params);
      if (!params.success) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid merchant slug." } });
      const merchant = await service.getMerchant(params.data.slug);
      if (!merchant) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Merchant not found." } });
      return res.json({ data: merchant });
    } catch (error) { return next(error); }
  });

  router.get("/merchants/:slug/products", async (req, res, next) => {
    try {
      const params = merchantSlugSchema.safeParse(req.params);
      const query = productListQuerySchema.safeParse(req.query);
      if (!params.success || !query.success) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request parameters." } });
      const result = await service.listMerchantProducts(params.data.slug, query.data);
      if (!result) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Merchant not found." } });
      return res.json({ data: result.data, pagination: result.pagination });
    } catch (error) { return next(error); }
  });

  router.get("/products", async (req, res, next) => {
    try {
      const parsed = productListQuerySchema.safeParse(req.query);
      if (!parsed.success) return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "Invalid query parameters.", details: parsed.error.issues },
      });
      const result = await service.listProducts(parsed.data);
      return res.json({ data: result.data, pagination: result.pagination });
    } catch (error) { return next(error); }
  });

  router.get("/products/:productId", async (req, res, next) => {
    try {
      const params = productIdSchema.safeParse(req.params);
      if (!params.success) return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid product ID." } });
      const product = await service.getProduct(params.data.productId);
      if (!product) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Product not found." } });
      return res.json({ data: product });
    } catch (error) { return next(error); }
  });

  return router;
}
