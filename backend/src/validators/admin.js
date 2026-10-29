import { z } from "zod";

// The admin form sends "" for empty optional fields; store those as null.
const emptyToNull = (v) => (typeof v === "string" && v.trim() === "" ? null : v);

const text = (max = 200) => z.string().trim().min(1).max(max);
const optText = (max = 2000) => z.preprocess(emptyToNull, z.string().trim().max(max).nullable().optional());
const url = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => /^(\/|https:\/\/)/.test(v), "Must start with / or https://")
    .nullable()
    .optional()
);
const paise = z.number().int().min(0).max(100_000_000).nullable().optional();
const order = z.number().int().min(0).max(10_000).optional();

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(150),
  password: z.string().min(1).max(200),
});

export const trainerSchema = z.object({
  name: text(100),
  role: optText(100),
  gender: z.enum(["MALE", "FEMALE"]),
  isMainTrainer: z.boolean().optional(),
  bio: optText(),
  imageUrl: url,
  specializations: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  displayOrder: order,
  isActive: z.boolean().optional(),
});

export const serviceSchema = z.object({
  name: text(100),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,60}$/, "Lowercase letters, numbers and hyphens only"),
  description: optText(),
  category: optText(60),
  imageUrl: url,
  pricePaise: paise,
  displayOrder: order,
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const membershipSchema = z.object({
  name: text(60),
  durationMonths: z.number().int().min(1).max(60),
  pricePaise: paise,
  benefits: z.array(z.string().trim().min(1).max(150)).max(20).optional(),
  displayOrder: order,
  isActive: z.boolean().optional(),
});

const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use 24-hour HH:MM, e.g. 06:00");
export const timingSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: hhmm,
  endTime: hhmm,
  sessionType: z.enum(["UNISEX", "LADIES_ONLY"]),
  isActive: z.boolean().optional(),
});

export const timingUpdateSchema = timingSchema.partial();

export const supplementSchema = z.object({
  productName: text(120),
  brand: optText(80),
  description: optText(),
  size: optText(60),
  pricePaise: paise,
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "ON_REQUEST"]).optional(),
  imageUrl: url,
  isActive: z.boolean().optional(),
});

export const businessSchema = z.object({
  name: text(100),
  marathiName: optText(100),
  address: text(300),
  phone: text(30),
  googleRating: z.number().min(0).max(5).nullable().optional(),
  reviewCount: z.number().int().min(0).nullable().optional(),
  mapUrl: url,
  openingInfo: optText(200),
});

export const enquiryStatusSchema = z.object({ status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

const reqUrl = z
  .string()
  .trim()
  .min(1, "Required")
  .max(500)
  .refine((v) => /^(\/|https:\/\/)/.test(v), "Must start with / or https://");

export const testimonialSchema = z.object({
  displayName: text(60),
  quote: text(600),
  rating: z.preprocess(emptyToNull, z.number().int().min(1).max(5).nullable().optional()),
  photoUrl: url,
  displayOrder: order,
  isActive: z.boolean().optional(),
});

export const gallerySchema = z.object({
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  url: reqUrl,
  posterUrl: url,
  caption: optText(200),
  displayOrder: order,
  isActive: z.boolean().optional(),
});

const ctaUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(300)
    .refine((v) => /^(\/|https:\/\/|tel:\+?[0-9]+$)/.test(v), "Use /page, https://... or tel:+91...")
    .nullable()
    .optional()
);

export const promotionSchema = z.object({
  title: text(80),
  description: optText(500),
  terms: optText(1000),
  imageUrl: url,
  theme: z.enum(["DEFAULT", "DIWALI", "VALENTINES", "NEW_YEAR", "GANESH_CHATURTHI", "ANNIVERSARY"]).optional(),
  emojis: z.preprocess(emptyToNull, z.string().trim().max(24).nullable().optional()),
  ctaText: optText(40),
  ctaUrl,
  format: z.enum(["POPUP", "BANNER", "CARD"]).optional(),
  frequency: z.enum(["EVERY_VISIT", "ONCE_PER_SESSION", "ONCE_PER_DAY", "ONCE_PER_WEEK", "ONCE"]).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  isActive: z.boolean().optional(),
});
