import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const db = vi.hoisted(() => ({
  $queryRaw: vi.fn().mockResolvedValue([1]),
  businessProfile: { findUnique: vi.fn() },
  trainer: { findMany: vi.fn() },
  service: { findMany: vi.fn() },
  membershipPlan: { findMany: vi.fn() },
  gymTiming: { findMany: vi.fn() },
  supplement: { findMany: vi.fn() },
  enquiry: { create: vi.fn() },
}));
vi.mock("../src/config/prisma.js", () => ({ default: db }));

const { default: app } = await import("../src/app.js");
beforeEach(() => vi.clearAllMocks());

describe("public endpoints", () => {
  it("GET /api/trainers returns active trainers", async () => {
    db.trainer.findMany.mockResolvedValue([{ id: 1, name: "Atish Babu Shinde" }]);
    const res = await request(app).get("/api/trainers");
    expect(res.status).toBe(200);
    expect(res.body.data[0].name).toBe("Atish Babu Shinde");
    expect(db.trainer.findMany.mock.calls[0][0].where).toEqual({ isActive: true });
  });
  it("GET /api/business returns 404 when not seeded", async () => {
    db.businessProfile.findUnique.mockResolvedValue(null);
    const res = await request(app).get("/api/business");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/enquiries", () => {
  const valid = { fullName: "Test User", phone: "+91 98765 43210", enquiryType: "MEMBERSHIP" };

  it("stores a valid enquiry", async () => {
    db.enquiry.create.mockResolvedValue({ id: 5 });
    const res = await request(app).post("/api/enquiries").send(valid);
    expect(res.status).toBe(201);
    expect(res.body.data).toEqual({ id: 5, received: true });
    expect(db.enquiry.create).toHaveBeenCalledOnce();
  });
  it("rejects invalid data with field errors", async () => {
    const res = await request(app).post("/api/enquiries").send({ fullName: "A", phone: "abc" });
    expect(res.status).toBe(400);
    expect(res.body.fields.phone).toBeDefined();
    expect(db.enquiry.create).not.toHaveBeenCalled();
  });
  it("silently drops honeypot submissions", async () => {
    const res = await request(app).post("/api/enquiries").send({ ...valid, website: "spam.com" });
    expect(res.status).toBe(201);
    expect(db.enquiry.create).not.toHaveBeenCalled();
  });
});
