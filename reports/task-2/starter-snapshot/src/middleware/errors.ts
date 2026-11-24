import type { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response) {
  return res.status(404).json({ error: { code: "NOT_FOUND", message: "The requested resource was not found." } });
}

export function errorHandler(err: Error & { statusCode?: number; code?: string }, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode ?? 500;
  if (status >= 500) {
    // Replace with approved structured logger; never log credentials or request bodies here.
    console.error("Unhandled application error", { name: err.name, message: err.message });
  }
  return res.status(status).json({
    error: {
      code: err.code ?? (status >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR"),
      message: status >= 500 ? "An unexpected error occurred." : err.message
    }
  });
}
