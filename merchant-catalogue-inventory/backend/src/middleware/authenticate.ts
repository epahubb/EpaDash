import type { PrismaClient, Role } from "@prisma/client";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { HttpError } from "../common/http-error.js";

declare global {
  namespace Express {
    interface Locals {
      actor: { id: string; roles: Role[] };
    }
  }
}

export function authenticate(db: PrismaClient, secret: string): RequestHandler {
  return async (req, res, next) => {
    const invalidToken = new HttpError(401, "UNAUTHENTICATED", "A valid access token is required.");
    const match = /^Bearer (\S+)$/i.exec(req.get("authorization") ?? "");
    if (!match) throw invalidToken;

    let payload: string | jwt.JwtPayload;
    try {
      payload = jwt.verify(match[1], secret, { algorithms: ["HS256"] });
    } catch {
      throw invalidToken;
    }
    const claims = z.object({ sub: z.string().uuid(), exp: z.number() }).safeParse(payload);
    if (!claims.success) throw invalidToken;

    const user = await db.user.findUnique({
      where: { id: claims.data.sub },
      select: { id: true, status: true, roles: { select: { role: true } } },
    });
    if (user?.status !== "ACTIVE") throw invalidToken;

    res.locals.actor = { id: user.id, roles: user.roles.map(({ role }) => role) };
    next();
  };
}

export function requireRole(role: Role): RequestHandler {
  return (_req, res, next) => {
    if (!res.locals.actor?.roles.includes(role)) {
      throw new HttpError(403, "FORBIDDEN", "You do not have permission to perform this action.");
    }
    next();
  };
}
