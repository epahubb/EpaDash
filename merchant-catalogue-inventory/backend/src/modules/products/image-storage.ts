export const productImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const minProductImageBytes = 16;
export const maxProductImageBytes = 5 * 1024 * 1024;
export const uploadUrlLifetimeSeconds = 300;
export const readUrlLifetimeSeconds = 60;

export type ProductImageObject = {
  objectKey: string;
  contentType: (typeof productImageTypes)[number];
  sizeBytes: number;
  checksumSha256: string;
};

export interface ProductImageStorage {
  presignUpload(image: ProductImageObject): Promise<{ url: string; headers: Record<string, string> }>;
  verifyUpload(image: ProductImageObject): Promise<boolean>;
  presignRead(image: ProductImageObject): Promise<string>;
}

export function hasImageSignature(type: ProductImageObject["contentType"], bytes: Uint8Array): boolean {
  const prefix = Buffer.from(bytes);
  switch (type) {
    case "image/jpeg":
      return prefix.subarray(0, 3).toString("hex") === "ffd8ff";
    case "image/png":
      return prefix.subarray(0, 16).toString("hex") === "89504e470d0a1a0a0000000d49484452";
    case "image/webp":
      return prefix.toString("latin1", 0, 4) === "RIFF" && prefix.toString("latin1", 8, 12) === "WEBP"
        && ["VP8 ", "VP8L", "VP8X"].includes(prefix.toString("latin1", 12, 16));
  }
}
