import { Router } from "express";
import prisma from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  let database = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    console.error("Health check: database unreachable:", err.message);
    database = "unreachable";
  }
  res.status(database === "connected" ? 200 : 503).json({
    status: database === "connected" ? "ok" : "degraded",
    database,
    time: new Date().toISOString(),
  });
});

export default router;
