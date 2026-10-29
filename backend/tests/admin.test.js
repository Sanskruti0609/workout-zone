import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

vi.hoisted(() => { process.env.JWT_SECRET = "x".repeat(48); });

const db = vi.hoisted(() => ({
  $queryRaw: vi.fn(),
  adminUser: { findUnique: vi.fn() },
  trainer: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() },
  gymTiming: { findMany: vi.fn(), delete: vi.fn() },
  enquiry: { findMany: vi.fn(), count: vi.fn(), update: vi.fn() },
}));
vi.mock("../src/config/prisma.js", () => ({ default: db }));

const { default: app } = await import("../src/app.js");
const H = { "X-Requested-With": "WorkoutZoneAdmin" };
const hash = bcrypt.hashSync("correct-horse-battery", 4);

// Logins are rate-limited (10 per 15 min), so each role logs in once and the session is reused.
const sessions = {};
async function login(role = "ADMIN") {
  if (sessions[role]) return sessions[role];
  db.adminUser.findUnique.mockResolvedValue({ id: 1, name: "Owner", email: "a@b.com", role, passwordHash: hash });
  const agent = request.agent(app);
  const res = await agent.post("/api/admin/login").set(H).send({ email: "A@B.com", password: "correct-horse-battery" });
  expect(res.status).toBe(200);
  sessions[role] = agent;
  return agent;
}

beforeEach(() => vi.clearAllMocks());

describe("admin auth", () => {
  it("rejects a wrong password with a generic message", async () => {
    db.adminUser.findUnique.mockResolvedValue({ id: 1, name: "O", email: "a@b.com", role: "ADMIN", passwordHash: hash });
    const res = await request(app).post("/api/admin/login").set(H).send({ email: "a@b.com", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });
  it("rejects an unknown email the same way", async () => {
    db.adminUser.findUnique.mockResolvedValue(null);
    const res = await request(app).post("/api/admin/login").set(H).send({ email: "x@y.com", password: "whatever" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });
  it("blocks admin routes without a session", async () => {
    expect((await request(app).get("/api/admin/trainers")).status).toBe(401);
    expect((await request(app).get("/api/admin/enquiries")).status).toBe(401);
  });
  it("requires the CSRF header on writes", async () => {
    const res = await request(app).post("/api/admin/login").send({ email: "a@b.com", password: "x" });
    expect(res.status).toBe(403);
  });
  it("sets an HttpOnly cookie and never returns the password hash", async () => {
    db.adminUser.findUnique.mockResolvedValue({ id: 1, name: "O", email: "a@b.com", role: "ADMIN", passwordHash: hash });
    const res = await request(app).post("/api/admin/login").set(H).send({ email: "a@b.com", password: "correct-horse-battery" });
    expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/);
    expect(JSON.stringify(res.body)).not.toMatch(/passwordHash/);
  });
});

describe("admin CRUD", () => {
  it("lists trainers when logged in", async () => {
    const agent = await login();
    db.trainer.findMany.mockResolvedValue([{ id: 1, name: "A" }]);
    const res = await agent.get("/api/admin/trainers");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
  it("validates input and rejects unsafe image URLs", async () => {
    const agent = await login();
    expect((await agent.post("/api/admin/trainers").set(H).send({ name: "X", gender: "ROBOT" })).status).toBe(400);
    expect((await agent.post("/api/admin/trainers").set(H).send({ name: "Test", gender: "MALE", imageUrl: "javascript:alert(1)" })).status).toBe(400);
    expect(db.trainer.create).not.toHaveBeenCalled();
  });
  it("creates and deactivates a trainer", async () => {
    const agent = await login();
    db.trainer.create.mockResolvedValue({ id: 9 });
    expect((await agent.post("/api/admin/trainers").set(H).send({ name: "New Trainer", gender: "FEMALE" })).status).toBe(201);
    db.trainer.update.mockResolvedValue({ id: 9, isActive: false });
    expect((await agent.patch("/api/admin/trainers/9").set(H).send({ isActive: false })).status).toBe(200);
  });
  it("lets only ADMIN delete timings", async () => {
    const editor = await login("EDITOR");
    expect((await editor.delete("/api/admin/timings/1").set(H)).status).toBe(403);
    const admin = await login("ADMIN");
    db.gymTiming.delete.mockResolvedValue({});
    expect((await admin.delete("/api/admin/timings/1").set(H)).status).toBe(204);
  });
  it("pages enquiries and updates status", async () => {
    const agent = await login();
    db.enquiry.findMany.mockResolvedValue([{ id: 3 }]);
    db.enquiry.count.mockResolvedValue(1);
    const list = await agent.get("/api/admin/enquiries?status=NEW");
    expect(list.body.meta.total).toBe(1);
    db.enquiry.update.mockResolvedValue({ id: 3, status: "CONTACTED" });
    expect((await agent.patch("/api/admin/enquiries/3").set(H).send({ status: "CONTACTED" })).status).toBe(200);
    expect((await agent.patch("/api/admin/enquiries/3").set(H).send({ status: "BOGUS" })).status).toBe(400);
  });
});

describe("empty optional fields from the admin form", () => {
  it("accepts an empty photo and bio and stores them as null", async () => {
    const agent = await login();
    db.trainer.create.mockResolvedValue({ id: 10 });
    const res = await agent.post("/api/admin/trainers").set(H).send({ name: "No Photo", gender: "MALE", imageUrl: "", bio: "", role: "" });
    expect(res.status).toBe(201);
    const data = db.trainer.create.mock.calls[0][0].data;
    expect(data.imageUrl).toBeNull();
    expect(data.bio).toBeNull();
  });
});
