import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authenticate, requireRole } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validate";
import { updateAccountStatusSchema, updateMeSchema } from "./user.schemas";

export const usersRouter = Router();
usersRouter.use(authenticate);

usersRouter.get("/me", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth!.userId },
      select: { id: true, email: true, displayName: true, phone: true, status: true, createdAt: true, updatedAt: true,
        userRoles: { select: { role: true } } }
    });
    if (!user) return res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User not found." } });
    res.json({ data: { ...user, roles: user.userRoles.map(r => r.role), userRoles: undefined } });
  } catch (error) { next(error); }
});

usersRouter.patch("/me", validateBody(updateMeSchema), async (req, res, next) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.auth!.userId },
      data: req.body,
      select: { id: true, email: true, displayName: true, phone: true, status: true, updatedAt: true }
    });
    res.json({ data: user });
  } catch (error) { next(error); }
});

