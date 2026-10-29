import { it, expect, vi } from "vitest";
import request from "supertest";

const db = vi.hoisted(() => ({ $queryRaw: vi.fn() }));
vi.mock("../src/config/prisma.js", () => ({ default: db }));
const { default: app } = await import("../src/app.js");

it("health is ok when the database responds", async () => {
  db.$queryRaw.mockResolvedValue([1]);
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
  expect(res.body.database).toBe("connected");
});
it("health reports 503 when the database is down", async () => {
  db.$queryRaw.mockRejectedValue(new Error("down"));
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(503);
  expect(res.body.database).toBe("unreachable");
});
it("unknown routes return JSON 404", async () => {
  expect((await request(app).get("/api/nope")).status).toBe(404);
});
