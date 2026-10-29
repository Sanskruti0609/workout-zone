import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import os from "node:os";
import fs from "node:fs";
import path from "node:path";

const tmp = vi.hoisted(() => {
  const dir = `${process.env.TMPDIR || "/tmp"}/wz-upload-test-${Date.now()}`;
  process.env.JWT_SECRET = "y".repeat(48);
  process.env.UPLOAD_DIR = dir;
  return dir;
});

const db = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  adminUser: { findUnique: vi.fn() },
  promotion: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  testimonial: { findMany: vi.fn(), create: vi.fn() },
  galleryItem: { findMany: vi.fn(), create: vi.fn() },
  service: { findMany: vi.fn() },
}));
vi.mock("../src/config/prisma.js", () => ({ default: db }));

const { default: app } = await import("../src/app.js");
const H = { "X-Requested-With": "WorkoutZoneAdmin" };
let agent;

beforeAll(async () => {
  db.adminUser.findUnique.mockResolvedValue({
    id: 1, name: "Owner", email: "a@b.com", role: "ADMIN", passwordHash: bcrypt.hashSync("correct-horse-battery", 4),
  });
  agent = request.agent(app);
  const res = await agent.post("/api/admin/login").set(H).send({ email: "a@b.com", password: "correct-horse-battery" });
  expect(res.status).toBe(200);
});
beforeEach(() => vi.clearAllMocks());

describe("public content endpoints", () => {
  it("returns null when no promotion is active", async () => {
    db.promotion.findFirst.mockResolvedValue(null);
    const res = await request(app).get("/api/promotions/active");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });
  it("asks the database only for enabled promotions inside their date range, highest priority first", async () => {
    db.promotion.findFirst.mockResolvedValue({ id: 1, title: "Diwali" });
    await request(app).get("/api/promotions/active");
    const args = db.promotion.findFirst.mock.calls[0][0];
    expect(args.where.isActive).toBe(true);
    expect(args.where.startsAt.lte).toBeInstanceOf(Date);
    expect(args.where.endsAt.gte).toBeInstanceOf(Date);
    expect(args.orderBy[0]).toEqual({ priority: "desc" });
    expect(args.select.isActive).toBeUndefined(); // internal fields are not exposed
  });
  it("lists only active testimonials and gallery items", async () => {
    db.testimonial.findMany.mockResolvedValue([]);
    db.galleryItem.findMany.mockResolvedValue([]);
    await request(app).get("/api/testimonials");
    await request(app).get("/api/gallery");
    expect(db.testimonial.findMany.mock.calls[0][0].where).toEqual({ isActive: true });
    expect(db.galleryItem.findMany.mock.calls[0][0].where).toEqual({ isActive: true });
  });
  it("filters featured services", async () => {
    db.service.findMany.mockResolvedValue([]);
    await request(app).get("/api/services?featured=true");
    expect(db.service.findMany.mock.calls[0][0].where).toEqual({ isActive: true, isFeatured: true });
  });
});

describe("admin content management", () => {
  const promo = { title: "Diwali Offer", startsAt: "2026-11-01T00:00:00.000Z", endsAt: "2026-11-10T00:00:00.000Z", ctaUrl: "/contact" };

  it("requires login for promotions, testimonials, gallery and uploads", async () => {
    for (const p of ["promotions", "testimonials", "gallery"]) {
      expect((await request(app).get(`/api/admin/${p}`)).status).toBe(401);
    }
    expect((await request(app).post("/api/admin/uploads").set(H)).status).toBe(401);
  });
  it("creates a promotion as a draft-friendly record", async () => {
    db.promotion.create.mockResolvedValue({ id: 1 });
    const res = await agent.post("/api/admin/promotions").set(H).send(promo);
    expect(res.status).toBe(201);
  });
  it("rejects an end date before the start date", async () => {
    const res = await agent.post("/api/admin/promotions").set(H).send({ ...promo, endsAt: "2026-10-01T00:00:00.000Z" });
    expect(res.status).toBe(400);
    expect(db.promotion.create).not.toHaveBeenCalled();
  });
  it("rejects unsafe call-to-action links", async () => {
    const res = await agent.post("/api/admin/promotions").set(H).send({ ...promo, ctaUrl: "javascript:alert(1)" });
    expect(res.status).toBe(400);
  });
  it("accepts a testimonial with no photo or rating, and rejects rating 9", async () => {
    db.testimonial.create.mockResolvedValue({ id: 1 });
    expect((await agent.post("/api/admin/testimonials").set(H).send({ displayName: "A. Member", quote: "Great gym", photoUrl: "", rating: "" })).status).toBe(201);
    expect((await agent.post("/api/admin/testimonials").set(H).send({ displayName: "A", quote: "x", rating: 9 })).status).toBe(400);
  });
  it("requires a media URL for gallery items", async () => {
    expect((await agent.post("/api/admin/gallery").set(H).send({ mediaType: "IMAGE", url: "" })).status).toBe(400);
    db.galleryItem.create.mockResolvedValue({ id: 1 });
    expect((await agent.post("/api/admin/gallery").set(H).send({ mediaType: "VIDEO", url: "/uploads/a.mp4", caption: "" })).status).toBe(201);
  });
});

describe("uploads", () => {
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(64)]);

  it("stores a real PNG and serves it with safe headers", async () => {
    const res = await agent.post("/api/admin/uploads").set(H).attach("file", png, { filename: "x.png", contentType: "image/png" });
    expect(res.status).toBe(201);
    expect(res.body.data.url).toMatch(/^\/uploads\/[0-9a-f-]{36}\.png$/);
    const file = await request(app).get(res.body.data.url);
    expect(file.status).toBe(200);
    expect(file.headers["x-content-type-options"]).toBe("nosniff");
    expect(file.headers["cross-origin-resource-policy"]).toBe("cross-origin");
  });
  it("rejects a file whose content does not match its declared type", async () => {
    const res = await agent.post("/api/admin/uploads").set(H).attach("file", Buffer.from("<script>alert(1)</script>"), { filename: "x.png", contentType: "image/png" });
    expect(res.status).toBe(400);
    expect(fs.readdirSync(tmp).filter((f) => f.endsWith(".png"))).toHaveLength(1); // only the valid one remains
  });
  it("rejects disallowed types such as SVG and HTML", async () => {
    const svg = await agent.post("/api/admin/uploads").set(H).attach("file", Buffer.from("<svg/>"), { filename: "x.svg", contentType: "image/svg+xml" });
    expect(svg.status).toBe(400);
    const html = await agent.post("/api/admin/uploads").set(H).attach("file", Buffer.from("<html>"), { filename: "x.html", contentType: "text/html" });
    expect(html.status).toBe(400);
  });
});
