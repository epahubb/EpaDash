import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "The request contains invalid fields.",
          details: result.error.issues.map(issue => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        }
      });
    }
    req.body = result.data;
    next();
  };
}
