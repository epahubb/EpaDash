import { describe, expect, it } from "vitest";
import { isInStock, isPublicMerchant, isPublicProduct } from "../src/lib/discovery-visibility";

describe("public merchant visibility", () => {
  it("allows only active public merchants", () => {
    expect(isPublicMerchant({ status: "ACTIVE", isPublic: true })).toBe(true);
    expect(isPublicMerchant({ status: "SUSPENDED", isPublic: true })).toBe(false);
    expect(isPublicMerchant({ status: "ACTIVE", isPublic: false })).toBe(false);
  });
});

describe("public product visibility", () => {
  const activeMerchant = { status: "ACTIVE", isPublic: true };
  it("requires published, available product and active public merchant", () => {
    expect(isPublicProduct({ status: "PUBLISHED", isAvailable: true, merchant: activeMerchant })).toBe(true);
    expect(isPublicProduct({ status: "DRAFT", isAvailable: true, merchant: activeMerchant })).toBe(false);
    expect(isPublicProduct({ status: "PUBLISHED", isAvailable: false, merchant: activeMerchant })).toBe(false);
    expect(isPublicProduct({ status: "PUBLISHED", isAvailable: true, merchant: { status: "SUSPENDED", isPublic: true } })).toBe(false);
  });
});

describe("sellable stock", () => {
  it("subtracts reserved stock from on-hand stock", () => {
    expect(isInStock(5, 2)).toBe(true);
    expect(isInStock(2, 2)).toBe(false);
    expect(isInStock(0, 0)).toBe(false);
    expect(isInStock(2, 3)).toBe(false);
  });
});
