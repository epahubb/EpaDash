import { z } from "zod";

const positiveInt = (fallback: number, max: number) =>
  z.coerce.number().int().positive().max(max).default(fallback);

export const listQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  categoryId: z.string().uuid().optional(),
  page: positiveInt(1, 1_000_000),
  limit: positiveInt(20, 100),
  sort: z.enum(["relevance", "name", "newest"]).default("relevance"),
});

export const productListQuerySchema = listQuerySchema.extend({
  merchantId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
}).refine(
  (value) => value.minPrice === undefined || value.maxPrice === undefined || value.minPrice <= value.maxPrice,
  { message: "minPrice must not exceed maxPrice", path: ["minPrice"] },
);

export const merchantSlugSchema = z.object({
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const productIdSchema = z.object({
  productId: z.string().uuid(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
