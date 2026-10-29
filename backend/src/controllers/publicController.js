import * as svc from "../services/publicService.js";

const wrap = (fn) => async (req, res) => res.json({ data: await fn(req) });

export const business = wrap(svc.getBusiness);
export const trainers = wrap(svc.getTrainers);
export const services = wrap((req) => svc.getServices({ featured: req.query.featured === "true" }));
export const memberships = wrap(svc.getMemberships);
export const timings = wrap(svc.getTimings);
export const supplements = wrap(svc.getSupplements);
export const testimonials = wrap(svc.getTestimonials);
export const gallery = wrap(svc.getGallery);
export const activePromotion = async (_req, res) => {
  res.set("Cache-Control", "no-cache");
  res.json({ data: await svc.getActivePromotion() });
};
