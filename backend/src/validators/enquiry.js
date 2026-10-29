import { z } from "zod";

const optionalText = (max) =>
  z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().email("Please enter a valid email").optional()),
  enquiryType: z
    .enum(["MEMBERSHIP", "HYROX", "YOGA", "SUPPLEMENTS", "STEAM_MASSAGE", "LADIES_SESSIONS", "GENERAL"])
    .default("GENERAL"),
  preferredVisitTime: optionalText(100),
  message: optionalText(1000),
  // Honeypot: real visitors never see or fill this field.
  website: z.string().max(200).optional(),
});
