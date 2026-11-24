import { z } from "zod";

export const uuid = z.string().uuid();
const name = z.string().trim().min(1).max(120);
const slug = z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const categoryIds = z.array(uuid).max(30)
  .refine((ids) => new Set(ids).size === ids.length, "Category IDs must be unique.");

const productFields = z.object({
  name,
  slug,
  description: z.string().trim().max(2000).nullable().optional(),
  sku: z.string().trim().min(1).max(80).nullable().optional(),
  unitPrice: z.string().regex(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/),
  currency: z.string().regex(/^[A-Z]{3}$/).optional(),
  categoryIds: categoryIds.optional(),
}).strict();

export const productCreate = productFields;
export const productUpdate = productFields.partial()
  .refine((fields) => Object.keys(fields).length > 0, "Provide at least one product field.");
export const productStatus = z.object({ status: z.enum(["DRAFT", "PUBLISHED"]) }).strict();
export const productAvailability = z.object({ isAvailable: z.boolean() }).strict();

const pagination = {
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
};
export const productList = z.object({
  ...pagination,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
}).strict();
export const categoryList = z.object(pagination).strict();
export const categoryCreate = z.object({ name, slug, parentId: uuid.optional() }).strict();
export const categoryUpdate = z.object({ name, slug }).strict().partial()
  .refine((fields) => Object.keys(fields).length > 0, "Provide at least one category field.");
