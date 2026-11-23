import type { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { HttpError } from "../../common/http-error.js";

const login = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(256),
}).strict();

export function createAuthRouter(db: PrismaClient, secret: string): Router {
  const router = Router();
  const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: { code: "RATE_LIMITED", message: "Try again later." } },
  });
  let dummyHash: string | undefined;

  router.post("/login", loginLimit, async (req, res) => {
    const { email, password } = login.parse(req.body);
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true, status: true, passwordHash: true, roles: { select: { role: true } } },
    });
    dummyHash ??= await argon2.hash("unused-login-verification");
    const verified = await argon2.verify(user?.passwordHash ?? dummyHash, password);
    if (!verified || user?.status !== "ACTIVE") {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }
    const accessToken = jwt.sign({ roles: user.roles.map(({ role }) => role) }, secret, {
      algorithm: "HS256",
      subject: user.id,
      expiresIn: "15m",
    });
    res.set("Cache-Control", "no-store").json({ data: { accessToken } });
  });

  return router;
}
