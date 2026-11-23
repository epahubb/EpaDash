import { z } from "zod";

export const updateMeSchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(30).nullable().optional()
}).refine(v => Object.keys(v).length > 0, { message: "Provide at least one field to update." });

export const updateAccountStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]),
  reason: z.string().trim().max(500).optional()
});
