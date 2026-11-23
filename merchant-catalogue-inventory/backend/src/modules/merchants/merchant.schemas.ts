import { z } from "zod";

const profileFields = {
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(2000).nullable(),
  phone: z.string().trim().min(1).max(30).nullable(),
  email: z.string().trim().email().max(254).nullable(),
  addressLine: z.string().trim().min(1).max(250).nullable(),
  city: z.string().trim().min(1).max(100).nullable(),
  region: z.string().trim().min(1).max(100).nullable(),
  countryCode: z.string().regex(/^[A-Z]{2}$/),
};

export const merchantApplication = z.object(profileFields).partial().required({
  name: true,
  slug: true,
}).strict();

export const merchantProfileUpdate = z.object(profileFields).partial().strict()
  .refine((input) => Object.keys(input).length > 0, "Provide at least one profile field.");

const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const hoursEntry = z.discriminatedUnion("isClosed", [
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    isClosed: z.literal(true),
    opensAt: z.null().default(null),
    closesAt: z.null().default(null),
  }).strict(),
  z.object({
    dayOfWeek: z.number().int().min(0).max(6),
    isClosed: z.literal(false),
    opensAt: time,
    closesAt: time,
  }).strict(),
]).refine((entry) => entry.isClosed || entry.opensAt < entry.closesAt,
  "Opening time must be before closing time. Split overnight hours across days.");

export const merchantHours = z.object({
  hours: z.array(hoursEntry).max(7).refine(
    (entries) => new Set(entries.map(({ dayOfWeek }) => dayOfWeek)).size === entries.length,
    "Each day may appear once.",
  ),
}).strict();

export const merchantAvailability = z.object({ acceptsOrders: z.boolean() }).strict();
export const merchantVerification = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) }).strict();
