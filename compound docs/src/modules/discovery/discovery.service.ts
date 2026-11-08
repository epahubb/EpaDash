import type { ListQuery, ProductListQuery } from "./discovery.schemas";
import { DiscoveryRepository } from "./discovery.repository";

function publicMerchant(row: any) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    logoUrl: row.logoUrl ?? null,
    coverImageUrl: row.coverImageUrl ?? null,
    phone: row.phone ?? null,
    address: {
      line: row.addressLine ?? null,
      city: row.city ?? null,
      region: row.region ?? null,
      latitude: row.latitude ?? null,
      longitude: row.longitude ?? null,
    },
    categories: (row.categories ?? []).map((x: any) => x.category),
    operatingHours: row.operatingHours ?? [],
    deliveryCoverage: (row.deliveryZones ?? []).map((z: any) => ({
      id: z.id, name: z.name, description: z.description ?? null,
    })),
    // Open-now is intentionally omitted until merchant timezone and special
    // holiday hours are modelled. Delivery eligibility is destination-specific.
  };
}

function publicProduct(row: any) {
  const onHand = row.inventory?.quantityOnHand;
  const held = row.inventory?.quantityHeld ?? 0;
  const stockKnown = typeof onHand === "number";
  const inStock = stockKnown ? onHand - held > 0 : null;
  return {
    id: row.id,
    merchantId: row.merchantId,
    merchant: row.merchant,
    name: row.name,
    slug: row.slug,
    sku: row.sku ?? null,
    description: row.description ?? null,
    price: String(row.price),
    currency: row.currency,
    imageUrl: row.imageUrl ?? null,
    isAvailable: row.isAvailable,
    inStock,
    categories: (row.categories ?? []).map((x: any) => x.category),
  };
}

export class DiscoveryService {
  constructor(private readonly repository: DiscoveryRepository) {}

  async listMerchants(query: ListQuery) {
    const result = await this.repository.listMerchants(query);
    return {
      data: result.items.map(publicMerchant),
      pagination: this.pagination(query.page, query.limit, result.totalItems),
    };
  }

  async getMerchant(slug: string) {
    const merchant = await this.repository.getMerchantBySlug(slug);
    return merchant ? publicMerchant(merchant) : null;
  }

  async listMerchantProducts(slug: string, query: ProductListQuery) {
    const result = await this.repository.listMerchantProducts(slug, query);
    if (!result) return null;
    return {
      data: result.items.map(publicProduct),
      pagination: this.pagination(query.page, query.limit, result.totalItems),
    };
  }

  async listProducts(query: ProductListQuery) {
    const result = await this.repository.listProducts(query);
    return {
      data: result.items.map(publicProduct),
      pagination: this.pagination(query.page, query.limit, result.totalItems),
    };
  }

  async getProduct(productId: string) {
    const product = await this.repository.getProductById(productId);
    return product ? publicProduct(product) : null;
  }

  private pagination(page: number, limit: number, totalItems: number) {
    return {
      page, limit, totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  }
}
