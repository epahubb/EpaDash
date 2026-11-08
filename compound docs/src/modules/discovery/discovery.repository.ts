import { PrismaClient } from "@prisma/client";
import type { ListQuery, ProductListQuery } from "./discovery.schemas";

/**
 * Prisma adapter for the proposed Task 3 schema.
 *
 * IMPORTANT: relation/column names in the Task 3 design are conceptual.
 * Before generating Prisma Client, reconcile the query fields below with the
 * team's final schema. The integration checklist names every expected field.
 */
export class DiscoveryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listMerchants(query: ListQuery) {
    const where: any = {
      status: "ACTIVE",
      isPublic: true,
      ...(query.categoryId ? {
        categories: { some: { categoryId: query.categoryId } },
      } : {}),
      ...(query.q ? {
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { description: { contains: query.q, mode: "insensitive" } },
        ],
      } : {}),
    };

    const orderBy: any =
      query.sort === "name" ? { name: "asc" } :
      query.sort === "newest" ? { createdAt: "desc" } :
      [{ name: "asc" }, { id: "asc" }];

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.merchant.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true, name: true, slug: true, description: true,
          logoUrl: true, coverImageUrl: true, phone: true,
          addressLine: true, city: true, region: true,
          latitude: true, longitude: true, createdAt: true,
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          operatingHours: { select: { dayOfWeek: true, opensAt: true, closesAt: true, isClosed: true } },
          deliveryZones: { where: { isActive: true }, select: { id: true, name: true, description: true } },
        },
      } as any),
      this.prisma.merchant.count({ where } as any),
    ]);
    return { items, totalItems };
  }

  async getMerchantBySlug(slug: string) {
    return this.prisma.merchant.findFirst({
      where: { slug, status: "ACTIVE", isPublic: true } as any,
      select: {
        id: true, name: true, slug: true, description: true,
        logoUrl: true, coverImageUrl: true, phone: true,
        addressLine: true, city: true, region: true,
        latitude: true, longitude: true, createdAt: true,
        categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
        operatingHours: { select: { dayOfWeek: true, opensAt: true, closesAt: true, isClosed: true } },
        deliveryZones: { where: { isActive: true }, select: { id: true, name: true, description: true } },
      },
    } as any);
  }

  async listMerchantProducts(slug: string, query: ProductListQuery) {
    const merchant = await this.prisma.merchant.findFirst({
      where: { slug, status: "ACTIVE", isPublic: true } as any,
      select: { id: true },
    } as any);
    if (!merchant) return null;
    return this.listProducts({ ...query, merchantId: merchant.id });
  }

  async listProducts(query: ProductListQuery) {
    const where: any = {
      status: "PUBLISHED",
      isAvailable: true,
      merchant: { status: "ACTIVE", isPublic: true },
      ...(query.merchantId ? { merchantId: query.merchantId } : {}),
      ...(query.categoryId ? {
        categories: { some: { categoryId: query.categoryId } },
      } : {}),
      ...(query.q ? {
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { description: { contains: query.q, mode: "insensitive" } },
          { sku: { contains: query.q, mode: "insensitive" } },
        ],
      } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined ? {
        price: {
          ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
          ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
        },
      } : {}),
    };

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: query.sort === "newest" ? { createdAt: "desc" } :
          query.sort === "name" ? { name: "asc" } : [{ name: "asc" }, { id: "asc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        select: {
          id: true, merchantId: true, name: true, slug: true, sku: true,
          description: true, price: true, currency: true, imageUrl: true,
          isAvailable: true, createdAt: true,
          merchant: { select: { id: true, name: true, slug: true } },
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          inventory: { select: { quantityOnHand: true, quantityHeld: true } },
        },
      } as any),
      this.prisma.product.count({ where } as any),
    ]);
    return { items, totalItems };
  }

  async getProductById(productId: string) {
    return this.prisma.product.findFirst({
      where: {
        id: productId,
        status: "PUBLISHED",
        isAvailable: true,
        merchant: { status: "ACTIVE", isPublic: true },
      } as any,
      select: {
        id: true, merchantId: true, name: true, slug: true, sku: true,
        description: true, price: true, currency: true, imageUrl: true,
        isAvailable: true, createdAt: true,
        merchant: { select: { id: true, name: true, slug: true } },
        categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
        inventory: { select: { quantityOnHand: true, quantityHeld: true } },
      },
    } as any);
  }
}
