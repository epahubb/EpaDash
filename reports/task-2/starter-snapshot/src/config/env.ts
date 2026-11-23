import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().positive().default(30),
  REFRESH_COOKIE_NAME: z.string().default("epadash_refresh"),
  COOKIE_SECURE: z.string().default("false").transform(v => v === "true"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  PASSWORD_RESET_TTL_MINUTES: z.coerce.number().int().positive().default(30)
});

export const env = schema.parse(process.env);
