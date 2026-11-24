import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { AwsClient } from "aws4fetch";
import { createS3ImageStorage } from "../../src/modules/products/s3-image-storage.js";

export async function startS3TestStorage() {
  const liveEndpoint = process.env.EPADASH_TEST_S3_ENDPOINT;
  if (liveEndpoint) {
    const bucket = `epadash-test-${randomUUID()}`;
    const accessKeyId = process.env.EPADASH_TEST_S3_ACCESS_KEY;
    const secretAccessKey = process.env.EPADASH_TEST_S3_SECRET_KEY;
    if (!accessKeyId || !secretAccessKey) throw new Error("Missing disposable S3 credentials.");
    const region = "us-east-1";
    const client = new AwsClient({ accessKeyId, secretAccessKey, region, service: "s3" });
    const result = await client.fetch(new URL(`/${bucket}`, liveEndpoint), { method: "PUT" });
    if (!result.ok) throw new Error(`Could not create the disposable S3 bucket (${result.status}).`);
    return {
      storage: createS3ImageStorage({ endpoint: liveEndpoint, bucket, region, accessKeyId, secretAccessKey }),
      // The operator owns and disposes of the entire isolated storage server.
      close: async () => {},
    };
  }

  const objects = new Map<string, { bytes: Buffer; type: string; checksum: string }>();
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "PUT") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk);
      const bytes = Buffer.concat(chunks);
      const checksum = createHash("sha256").update(bytes).digest("base64");
      if (checksum !== req.headers["x-amz-checksum-sha256"]) {
        res.writeHead(400).end();
        return;
      }
      if (req.headers["if-none-match"] === "*" && objects.has(url.pathname)) {
        res.writeHead(412).end();
        return;
      }
      objects.set(url.pathname, { bytes, type: req.headers["content-type"] ?? "", checksum });
      res.writeHead(200).end();
      return;
    }
    const object = objects.get(url.pathname);
    if (!object) {
      res.writeHead(404).end();
      return;
    }
    if (req.method === "HEAD") {
      res.writeHead(200, {
        "content-type": object.type, "content-length": object.bytes.length, "x-amz-checksum-sha256": object.checksum,
      }).end();
    } else if (req.headers.range === "bytes=0-15") {
      res.writeHead(206, { "content-length": 16, "content-range": `bytes 0-15/${object.bytes.length}` })
        .end(object.bytes.subarray(0, 16));
    } else if (req.method === "GET") {
      res.writeHead(200, { "content-type": object.type }).end(object.bytes);
    } else {
      res.writeHead(405).end();
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  return {
    storage: createS3ImageStorage({
      endpoint: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      bucket: "images",
      region: "us-east-1",
      accessKeyId: "test-access-key",
      secretAccessKey: "test-secret-key",
    }),
    close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}
