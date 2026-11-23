import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authenticate, requireRole } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validate";
import { updateAccountStatusSchema } from "./user.schemas";

export const adminUsersRouter = Router();
adminUsersRouter.use(authenticate, requireRole("ADMIN"));

adminUsersRouter.patch("/users/:userId/status", validateBody(updateAccountStatusSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: { status: req.body.status },
      select: { id: true, email: true, status: true }
    });
    // TODO: write an AuditLog record in the same transaction before production release.
    res.json({ data: user });
  } catch (error) { next(error); }
});
