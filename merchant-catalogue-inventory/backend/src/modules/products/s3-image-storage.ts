import { AwsClient } from "aws4fetch";
import { HttpError } from "../../common/http-error.js";
import {
  hasImageSignature, readUrlLifetimeSeconds, uploadUrlLifetimeSeconds,
  type ProductImageObject, type ProductImageStorage,
} from "./image-storage.js";

type S3ImageStorageConfig = {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

export function createS3ImageStorage(config: S3ImageStorageConfig): ProductImageStorage {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sessionToken: config.sessionToken,
    region: config.region,
    service: "s3",
  });
  const objectUrl = (key: string) => new URL(`/${config.bucket}/${key}`, config.endpoint);

  async function verifyRequest(image: ProductImageObject, method: "HEAD" | "GET", headers: Record<string, string>) {
    try {
      const request = await client.sign(objectUrl(image.objectKey), {
        method, headers, redirect: "error", signal: AbortSignal.timeout(5000),
      });
      return await fetch(request);
    } catch {
      throw new HttpError(502, "IMAGE_STORAGE_ERROR", "Image storage could not verify the upload.");
    }
  }

  return {
    async presignUpload(image) {
      const url = objectUrl(image.objectKey);
      url.searchParams.set("X-Amz-Expires", String(uploadUrlLifetimeSeconds));
      const headers = {
        "content-type": image.contentType,
        "content-length": String(image.sizeBytes),
        "if-none-match": "*",
        "x-amz-checksum-sha256": image.checksumSha256,
      };
      const signed = await client.sign(url, { method: "PUT", headers, aws: { signQuery: true, allHeaders: true } });
      // Browsers set the signed Content-Length automatically when sending the file.
      return { url: signed.url, headers: {
        "content-type": headers["content-type"],
        "if-none-match": headers["if-none-match"],
        "x-amz-checksum-sha256": headers["x-amz-checksum-sha256"],
      } };
    },

    async verifyUpload(image) {
      const head = await verifyRequest(image, "HEAD", { "x-amz-checksum-mode": "ENABLED" });
      if (head.status === 404 || head.status === 403) return false;
      if (!head.ok) throw new HttpError(502, "IMAGE_STORAGE_ERROR", "Image storage could not verify the upload.");
      if (
        head.headers.get("content-type") !== image.contentType
        || head.headers.get("content-length") !== String(image.sizeBytes)
        || head.headers.get("x-amz-checksum-sha256") !== image.checksumSha256
      ) return false;

      const prefix = await verifyRequest(image, "GET", { Range: "bytes=0-15" });
      if (prefix.status === 404 || prefix.status === 403) {
        await prefix.body?.cancel();
        return false;
      }
      if (prefix.status !== 206 || prefix.headers.get("content-length") !== "16") {
        await prefix.body?.cancel();
        throw new HttpError(502, "IMAGE_STORAGE_ERROR", "Image storage did not return the requested byte range.");
      }
      try {
        return hasImageSignature(image.contentType, new Uint8Array(await prefix.arrayBuffer()));
      } catch {
        throw new HttpError(502, "IMAGE_STORAGE_ERROR", "Image storage could not verify the upload.");
      }
    },

    async presignRead(image) {
      const url = objectUrl(image.objectKey);
      url.searchParams.set("X-Amz-Expires", String(readUrlLifetimeSeconds));
      url.searchParams.set("response-content-type", image.contentType);
      url.searchParams.set("response-content-disposition", "inline");
      url.searchParams.set("response-cache-control", "private, no-store");
      return (await client.sign(url, { method: "GET", aws: { signQuery: true } })).url;
    },
  };
}
