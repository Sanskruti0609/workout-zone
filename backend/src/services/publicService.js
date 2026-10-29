import prisma from "../config/prisma.js";
import { HttpError } from "../utils/httpError.js";

export async function getBusiness() {
  const business = await prisma.businessProfile.findUnique({ where: { id: 1 } });
  if (!business) throw new HttpError(404, "Business profile has not been set up yet");
  return business;
}

export const getTrainers = () =>
  prisma.trainer.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } });

export const getServices = ({ featured } = {}) =>
  prisma.service.findMany({
    where: { isActive: true, ...(featured ? { isFeatured: true } : {}) },
    orderBy: { displayOrder: "asc" },
  });

export const getMemberships = () =>
  prisma.membershipPlan.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } });

export const getTimings = () =>
  prisma.gymTiming.findMany({
    where: { isActive: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

export const getSupplements = () =>
  prisma.supplement.findMany({ where: { isActive: true }, orderBy: { productName: "asc" } });

export const getTestimonials = () =>
  prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } });

export const getGallery = () =>
  prisma.galleryItem.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } });

// Only an enabled promotion whose date range includes "now" is ever returned.
export async function getActivePromotion(now = new Date()) {
  return prisma.promotion.findFirst({
    where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
    orderBy: [{ priority: "desc" }, { startsAt: "desc" }],
    select: {
      id: true, title: true, description: true, terms: true, imageUrl: true, theme: true, emojis: true,
      ctaText: true, ctaUrl: true, format: true, frequency: true, startsAt: true, endsAt: true, updatedAt: true,
    },
  });
}
