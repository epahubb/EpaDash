import { expect, it } from "vitest";
import { hasImageSignature } from "../../src/modules/products/image-storage.js";

it("matches exact WebP signature bytes", () => {
  const prefix = Buffer.from("RIFF\x20\x00\x00\x00WEBPVP8X", "latin1");
  expect(hasImageSignature("image/webp", prefix)).toBe(true);
  prefix[0] |= 0x80;
  expect(hasImageSignature("image/webp", prefix)).toBe(false);
});
