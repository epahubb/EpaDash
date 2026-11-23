import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
  password: z.string().min(12).max(128),
  displayName: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(30).optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase()),
  password: z.string().min(1).max(128)
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(254).transform(v => v.toLowerCase())
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32).max(200),
  newPassword: z.string().min(12).max(128)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
