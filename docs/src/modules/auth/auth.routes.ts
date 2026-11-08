import { Router } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../../config/env";
import { validateBody } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { authService } from "./auth.service";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./auth.schemas";

export const authRouter = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

function setRefreshCookie(res: import("express").Response, token: string, expires: Date) {
  res.cookie(env.REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax",
    path: "/api/v1/auth",
    expires
  });
}

authRouter.post("/register", authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
    res.status(201).json({ data: { user: result.user, accessToken: result.accessToken } });
  } catch (error) { next(error); }
});

authRouter.post("/login", authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
    res.json({ data: { user: result.user, accessToken: result.accessToken } });
  } catch (error) { next(error); }
});

authRouter.post("/refresh", authLimiter, async (req, res, next) => {
  try {
    const raw = req.cookies?.[env.REFRESH_COOKIE_NAME];
    if (!raw) return res.status(401).json({ error: { code: "INVALID_REFRESH_TOKEN", message: "Refresh session is missing." } });
    const result = await authService.refresh(raw);
    setRefreshCookie(res, result.refreshToken, result.refreshExpiresAt);
    res.json({ data: { user: result.user, accessToken: result.accessToken } });
  } catch (error) { next(error); }
});

authRouter.post("/logout", authenticate, async (req, res, next) => {
  try {
    await authService.logout(req.cookies?.[env.REFRESH_COOKIE_NAME]);
    res.clearCookie(env.REFRESH_COOKIE_NAME, { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: "lax", path: "/api/v1/auth" });
    res.status(204).send();
  } catch (error) { next(error); }
});

authRouter.post("/password/forgot", authLimiter, validateBody(forgotPasswordSchema), async (req, res, next) => {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    // TODO: deliver result.rawTokenForDeliveryAdapter through the approved email/SMS provider.
    // Never return the raw token in a production HTTP response.
    void result;
    res.status(202).json({ data: { message: "If the account is eligible, password recovery instructions will be sent." } });
  } catch (error) { next(error); }
});

authRouter.post("/password/reset", authLimiter, validateBody(resetPasswordSchema), async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.newPassword);
    res.status(204).send();
  } catch (error) { next(error); }
});
