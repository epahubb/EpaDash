import { z } from "zod";

const environment = z.object({
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

const storageEnvironment = z.object({
  STORAGE_BUCKET: z.string().regex(/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/),
  STORAGE_REGION: z.string().regex(/^[a-z0-9-]+$/).default("us-east-1"),
  STORAGE_ENDPOINT: z.string().url().refine((value) => {
    if (!URL.canParse(value)) return false;
    const url = new URL(value);
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    return (url.protocol === "https:" || (local && url.protocol === "http:"))
      && !url.username && !url.password && !url.search && !url.hash && url.pathname === "/";
  }).optional(),
  STORAGE_ACCESS_KEY: z.string().min(1),
  STORAGE_SECRET_KEY: z.string().min(1),
  STORAGE_SESSION_TOKEN: z.string().min(1).optional(),
});

export function readEnvironment(values: NodeJS.ProcessEnv) {
  const parsed = environment.safeParse(values);
  if (!parsed.success) {
    const keys = parsed.error.issues.map(({ path }) => path.join("."));
    throw new Error(`Missing or invalid configuration: ${keys.join(", ")}`);
  }
  const storageValues = Object.fromEntries(
    Object.keys(storageEnvironment.shape).map((key) => [key, values[key]?.trim() || undefined]),
  );
  const storageConfigured = Object.entries(storageValues)
    .some(([key, value]) => key !== "STORAGE_REGION" && value !== undefined);
  if (!storageConfigured) return { ...parsed.data, storage: undefined };

  const storage = storageEnvironment.safeParse(storageValues);
  if (!storage.success) {
    const keys = storage.error.issues.map(({ path }) => path.join("."));
    throw new Error(`Missing or invalid image storage configuration: ${keys.join(", ")}`);
  }
  const settings = storage.data;
  return {
    ...parsed.data,
    storage: {
      endpoint: settings.STORAGE_ENDPOINT ?? `https://s3.${settings.STORAGE_REGION}.amazonaws.com`,
      bucket: settings.STORAGE_BUCKET,
      region: settings.STORAGE_REGION,
      accessKeyId: settings.STORAGE_ACCESS_KEY,
      secretAccessKey: settings.STORAGE_SECRET_KEY,
      sessionToken: settings.STORAGE_SESSION_TOKEN,
    },
  };
}
