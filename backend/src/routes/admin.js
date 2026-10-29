import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import prisma from "../config/prisma.js";
import { crudRouter } from "./adminCrud.js";
import {
  COOKIE_NAME, SESSION_HOURS, cookieOptions, signSession,
  requireAuth, requireCsrfHeader, requireRole,
} from "../middleware/auth.js";
import * as v from "../validators/admin.js";
import { HttpError } from "../utils/httpError.js";
import uploadRouter from "./uploads.js";

const router = Router();
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10); // keeps login timing similar for unknown emails

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: "Too many login attempts. Please try again in 15 minutes." },
});

router.post("/login", loginLimiter, requireCsrfHeader, async (req, res) => {
  const { email, password } = v.loginSchema.parse(req.body ?? {});
  const user = await prisma.adminUser.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, "Invalid email or password");
  res.cookie(COOKIE_NAME, signSession(user), { ...cookieOptions(), maxAge: SESSION_HOURS * 3600 * 1000 });
  res.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post("/logout", requireCsrfHeader, (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.status(204).end();
});

// Everything below requires a valid session.
router.use(requireAuth, requireCsrfHeader);

router.get("/me", (req, res) => res.json({ data: req.user }));

router.get("/business", async (_req, res) =>
  res.json({ data: await prisma.businessProfile.findUnique({ where: { id: 1 } }) }));
router.put("/business", requireRole("ADMIN"), async (req, res) => {
  const data = v.businessSchema.parse(req.body ?? {});
  res.json({ data: await prisma.businessProfile.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } }) });
});

router.use("/trainers", crudRouter({ model: "trainer", schema: v.trainerSchema, orderBy: { displayOrder: "asc" } }));
router.use("/services", crudRouter({ model: "service", schema: v.serviceSchema, orderBy: { displayOrder: "asc" } }));
router.use("/memberships", crudRouter({ model: "membershipPlan", schema: v.membershipSchema, orderBy: { displayOrder: "asc" } }));
router.use("/supplements", crudRouter({ model: "supplement", schema: v.supplementSchema, orderBy: { productName: "asc" } }));
router.use("/timings", crudRouter({
  model: "gymTiming", schema: v.timingSchema, updateSchema: v.timingUpdateSchema, allowDelete: true,
  orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
}));

const promoDates = (d) => {
  if (d.startsAt && d.endsAt && d.endsAt <= d.startsAt) throw new HttpError(400, "The end date must be after the start date");
};
router.use("/testimonials", crudRouter({ model: "testimonial", schema: v.testimonialSchema, orderBy: { displayOrder: "asc" }, allowDelete: true }));
router.use("/gallery", crudRouter({ model: "galleryItem", schema: v.gallerySchema, orderBy: { displayOrder: "asc" }, allowDelete: true }));
router.use("/promotions", crudRouter({ model: "promotion", schema: v.promotionSchema, orderBy: [{ startsAt: "desc" }], allowDelete: true, validate: promoDates }));
router.use("/uploads", uploadRouter);

router.get("/enquiries", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
  const where = ["NEW", "CONTACTED", "CLOSED"].includes(req.query.status) ? { status: req.query.status } : {};
  const [items, total] = await Promise.all([
    prisma.enquiry.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.enquiry.count({ where }),
  ]);
  res.json({ data: items, meta: { page, pageSize, total } });
});

router.patch("/enquiries/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Invalid id");
  const { status } = v.enquiryStatusSchema.parse(req.body ?? {});
  res.json({ data: await prisma.enquiry.update({ where: { id }, data: { status } }) });
});

export default router;
