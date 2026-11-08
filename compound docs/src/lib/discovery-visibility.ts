/** Pure policy helpers used by unit tests and by any future query adapter. */
export function isPublicMerchant(merchant: { status: string; isPublic: boolean }) {
  return merchant.status === "ACTIVE" && merchant.isPublic === true;
}

export function isPublicProduct(product: {
  status: string;
  isAvailable: boolean;
  merchant: { status: string; isPublic: boolean };
}) {
  return product.status === "PUBLISHED"
    && product.isAvailable === true
    && isPublicMerchant(product.merchant);
}

export function isInStock(quantityOnHand: number, quantityHeld: number) {
  if (!Number.isInteger(quantityOnHand) || !Number.isInteger(quantityHeld)) return false;
  if (quantityOnHand < 0 || quantityHeld < 0 || quantityHeld > quantityOnHand) return false;
  return quantityOnHand - quantityHeld > 0;
}
