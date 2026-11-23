import type { Request, Response, NextFunction } from "express";
import { authService } from "../modules/auth/auth.service";

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; roles: string[] };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Authentication is required." } });
  }
  try {
    const payload = authService.verifyAccessToken(header.slice(7));
    req.auth = { userId: payload.sub, roles: payload.roles ?? [] };
    next();
  } catch {
    return res.status(401).json({ error: { code: "INVALID_ACCESS_TOKEN", message: "Access token is invalid or expired." } });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.some(role => req.auth!.roles.includes(role))) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You do not have permission to perform this action." } });
    }
    next();
  };
}
