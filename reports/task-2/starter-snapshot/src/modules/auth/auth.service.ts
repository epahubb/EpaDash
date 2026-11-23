import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import { createOpaqueToken, hashPassword, hashToken, verifyPassword } from "../../lib/crypto";
import type { RegisterInput, LoginInput } from "./auth.schemas";

type Role = "CUSTOMER" | "MERCHANT" | "RIDER" | "ADMIN";
type JwtPayload = { sub: string; roles: Role[]; jti: string };

function issueAccessToken(userId: string, roles: Role[]): string {
  return jwt.sign(
    { roles, jti: randomUUID() },
    env.ACCESS_TOKEN_SECRET,
    { subject: userId, expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"] }
  );
}

function safeUser(user: { id: string; email: string; displayName: string; phone: string | null; status: string; userRoles: { role: string }[] }) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    phone: user.phone,
    status: user.status,
    roles: user.userRoles.map(r => r.role)
  };
}

async function createRefreshSession(userId: string) {
  const raw = createOpaqueToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(raw), expiresAt }
  });
  return { raw, expiresAt };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, ...(input.phone ? [{ phone: input.phone }] : [])] },
      select: { id: true }
    });
    if (existing) {
      const error = new Error("An account with those details already exists.");
      (error as Error & { statusCode?: number; code?: string }).statusCode = 409;
      (error as Error & { code?: string }).code = "ACCOUNT_CONFLICT";
      throw error;
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        displayName: input.displayName,
        phone: input.phone ?? null,
        passwordHash,
        status: "ACTIVE",
        userRoles: { create: { role: "CUSTOMER" } }
      },
      include: { userRoles: { select: { role: true } } }
    });

    const session = await createRefreshSession(user.id);
    const roles = user.userRoles.map(r => r.role as Role);
    return { user: safeUser(user), accessToken: issueAccessToken(user.id, roles), refreshToken: session.raw, refreshExpiresAt: session.expiresAt };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { userRoles: { select: { role: true } } }
    });

    // Same public error for unknown email and incorrect password.
    if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
      const error = new Error("Invalid email or password.");
      (error as Error & { statusCode?: number; code?: string }).statusCode = 401;
      (error as Error & { code?: string }).code = "INVALID_CREDENTIALS";
      throw error;
    }
    if (user.status !== "ACTIVE") {
      const error = new Error("This account is not currently active.");
      (error as Error & { statusCode?: number; code?: string }).statusCode = 403;
      (error as Error & { code?: string }).code = "ACCOUNT_NOT_ACTIVE";
      throw error;
    }

    const session = await createRefreshSession(user.id);
    const roles = user.userRoles.map(r => r.role as Role);
    return { user: safeUser(user), accessToken: issueAccessToken(user.id, roles), refreshToken: session.raw, refreshExpiresAt: session.expiresAt };
  },

  async refresh(rawToken: string) {
    const tokenHash = hashToken(rawToken);
    const stored = await prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: { user: { include: { userRoles: { select: { role: true } } } } }
    });
    if (!stored || stored.user.status !== "ACTIVE") {
      const error = new Error("Refresh session is invalid or expired.");
      (error as Error & { statusCode?: number; code?: string }).statusCode = 401;
      (error as Error & { code?: string }).code = "INVALID_REFRESH_TOKEN";
      throw error;
    }

    const nextRaw = createOpaqueToken();
    const nextExpires = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
    const roles = stored.user.userRoles.map(r => r.role as Role);
    await prisma.$transaction([
      prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
      prisma.refreshToken.create({ data: { userId: stored.userId, tokenHash: hashToken(nextRaw), expiresAt: nextExpires } })
    ]);
    return {
      user: safeUser(stored.user),
      accessToken: issueAccessToken(stored.userId, roles),
      refreshToken: nextRaw,
      refreshExpiresAt: nextExpires
    };
  },

  async logout(rawToken?: string) {
    if (!rawToken) return;
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, status: true } });
    // Caller always receives the same response. Delivery integration must be added by the application.
    if (!user || user.status !== "ACTIVE") return null;

    const raw = createOpaqueToken();
    const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000);
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hashToken(raw), expiresAt }
    });
    // Intentionally do not return or log the token. Connect an approved email/SMS provider here.
    return { userId: user.id, rawTokenForDeliveryAdapter: raw, expiresAt };
  },

  async resetPassword(rawToken: string, newPassword: string) {
    const stored = await prisma.passwordResetToken.findFirst({
      where: { tokenHash: hashToken(rawToken), usedAt: null, expiresAt: { gt: new Date() } }
    });
    if (!stored) {
      const error = new Error("Password reset token is invalid or expired.");
      (error as Error & { statusCode?: number; code?: string }).statusCode = 400;
      (error as Error & { code?: string }).code = "INVALID_RESET_TOKEN";
      throw error;
    }
    const passwordHash = await hashPassword(newPassword);
    await prisma.$transaction([
      prisma.user.update({ where: { id: stored.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: stored.id }, data: { usedAt: new Date() } }),
      prisma.refreshToken.updateMany({ where: { userId: stored.userId, revokedAt: null }, data: { revokedAt: new Date() } })
    ]);
  },

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
  }
};
