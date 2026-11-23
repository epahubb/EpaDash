import { Prisma, type PrismaClient } from "@prisma/client";
import { Router } from "express";
import { HttpError } from "../../common/http-error.js";
import { productAvailability, productCreate, productList, productStatus, productUpdate, uuid } from "./product.schemas.js";

const includeCategories = {
  categories: { select: { category: true }, orderBy: { categoryId: "asc" } },
} satisfies Prisma.ProductInclude;

type ProductWithCategories = Prisma.ProductGetPayload<{ include: typeof includeCategories }>;

function productResponse({ categories, unitPrice, ...product }: ProductWithCategories) {
  return { ...product, unitPrice: unitPrice.toFixed(2), categories: categories.map(({ category }) => category) };
}

async function categoryLinks(db: Prisma.TransactionClient, ids: string[]) {
  if (ids.length && await db.productCategory.count({ where: { id: { in: ids } } }) !== ids.length) {
    throw new HttpError(400, "UNKNOWN_PRODUCT_CATEGORY", "One or more product categories do not exist.");
  }
  return ids.map((id) => ({ category: { connect: { id } } }));
}

const editable = (ownerUserId: string, id: string) => ({
  id,
  merchant: { ownerUserId },
  status: { not: "ARCHIVED" as const },
});

export function createProductRouter(db: PrismaClient): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const { page, limit, status } = productList.parse(req.query);
    const { id: merchantId } = await db.merchant.findUniqueOrThrow({
      where: { ownerUserId: res.locals.actor.id }, select: { id: true },
    });
    const where = { merchantId, status: status ?? { not: "ARCHIVED" as const } };
    const [products, totalItems] = await db.$transaction([
      db.product.findMany({
        where, include: includeCategories, orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        skip: (page - 1) * limit, take: limit,
      }),
      db.product.count({ where }),
    ], { isolationLevel: "RepeatableRead" });
    res.json({ data: products.map(productResponse), pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } });
  });

  router.post("/", async (req, res) => {
    const { categoryIds = [], ...data } = productCreate.parse(req.body);
    const product = await db.$transaction(async (tx) => {
      const merchant = await tx.merchant.findUniqueOrThrow({
        where: { ownerUserId: res.locals.actor.id }, select: { id: true },
      });
      return tx.product.create({
        data: {
          ...data,
          merchant: { connect: { id: merchant.id } },
          categories: { create: await categoryLinks(tx, categoryIds) },
          inventory: { create: {} },
        },
        include: includeCategories,
      });
    });
    res.status(201).json({ data: productResponse(product) });
  });

  router.get("/:productId", async (req, res) => {
    const id = uuid.parse(req.params.productId);
    const product = await db.product.findUniqueOrThrow({
      where: { id, merchant: { ownerUserId: res.locals.actor.id } },
      include: includeCategories,
    });
    res.json({ data: productResponse(product) });
  });

  router.patch("/:productId", async (req, res) => {
    const id = uuid.parse(req.params.productId);
    const where = editable(res.locals.actor.id, id);
    const { categoryIds, ...data } = productUpdate.parse(req.body);
    const product = await db.$transaction(async (tx) => {
      // Lock the product before replacing category links. Prisma's nested writes
      // can otherwise race when two requests replace the same set.
      await tx.product.update({ where, data: { ...data, updatedAt: new Date() } });
      if (categoryIds !== undefined) {
        const categories = await categoryLinks(tx, categoryIds);
        await tx.productCategoryLink.deleteMany({ where: { productId: id } });
        return tx.product.update({
          where,
          data: { categories: { create: categories } },
          include: includeCategories,
        });
      }
      return tx.product.findUniqueOrThrow({ where, include: includeCategories });
    });
    res.json({ data: productResponse(product) });
  });

  router.patch("/:productId/status", async (req, res) => {
    const id = uuid.parse(req.params.productId);
    const ownerUserId = res.locals.actor.id;
    const { status } = productStatus.parse(req.body);
    const product = await db.$transaction(async (tx) => {
      if (status === "PUBLISHED") {
        const [merchant] = await tx.$queryRaw<Array<{ status: string }>>`
          SELECT "status" FROM "Merchant" WHERE "ownerUserId" = ${ownerUserId}::uuid FOR SHARE
        `;
        // Look up the owned product before returning a merchant state error.
        await tx.product.findUniqueOrThrow({ where: editable(ownerUserId, id), select: { id: true } });
        if (merchant?.status !== "ACTIVE") {
          throw new HttpError(409, "MERCHANT_NOT_ACTIVE", "Only active merchants can publish products.");
        }
      }
      return tx.product.update({ where: editable(ownerUserId, id), data: { status }, include: includeCategories });
    });
    res.json({ data: productResponse(product) });
  });

  router.patch("/:productId/availability", async (req, res) => {
    const id = uuid.parse(req.params.productId);
    const data = productAvailability.parse(req.body);
    const product = await db.product.update({
      where: editable(res.locals.actor.id, id), data, include: includeCategories,
    });
    res.json({ data: productResponse(product) });
  });

  router.delete("/:productId", async (req, res) => {
    const id = uuid.parse(req.params.productId);
    const ownerUserId = res.locals.actor.id;
    const { count } = await db.product.updateMany({
      where: editable(ownerUserId, id), data: { status: "ARCHIVED", isAvailable: false },
    });
    if (!count) {
      await db.product.findUniqueOrThrow({
        where: { id, merchant: { ownerUserId } }, select: { id: true },
      });
    }
    res.status(204).end();
  });

  return router;
}
