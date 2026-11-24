import { Prisma, type PrismaClient } from "@prisma/client";
import { Router, type RequestHandler } from "express";
import { HttpError } from "../../common/http-error.js";
import { categoryCreate, categoryList, categoryUpdate, uuid } from "./product.schemas.js";

export function listProductCategories(db: PrismaClient): RequestHandler {
  return async (req, res) => {
    const { page, limit } = categoryList.parse(req.query);
    const [data, totalItems] = await db.$transaction([
      db.productCategory.findMany({ orderBy: [{ name: "asc" }, { id: "asc" }], skip: (page - 1) * limit, take: limit }),
      db.productCategory.count(),
    ], { isolationLevel: "RepeatableRead" });
    res.json({ data, pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) } });
  };
}

export function createProductCategoryAdminRouter(db: PrismaClient): Router {
  const router = Router();
  router.post("/", async (req, res) => {
    const { parentId, ...fields } = categoryCreate.parse(req.body);
    const data = await db.productCategory.create({
      data: { ...fields, ...(parentId && { parent: { connect: { id: parentId } } }) },
    });
    res.status(201).json({ data });
  });
  router.patch("/:categoryId", async (req, res) => {
    const id = uuid.parse(req.params.categoryId);
    const data = await db.productCategory.update({ where: { id }, data: categoryUpdate.parse(req.body) });
    res.json({ data });
  });
  router.delete("/:categoryId", async (req, res) => {
    const id = uuid.parse(req.params.categoryId);
    try {
      await db.productCategory.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
        throw new HttpError(409, "PRODUCT_CATEGORY_IN_USE", "Remove category assignments and child categories first.");
      }
      throw error;
    }
    res.status(204).end();
  });
  return router;
}
