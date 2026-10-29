import path from "node:path";

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";
export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv,
  isProd,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  // Where admin-uploaded photos/videos are stored. Needs a persistent disk or volume in production.
  uploadDir: process.env.UPLOAD_DIR || path.resolve(process.cwd(), "uploads"),
  jwtSecret: process.env.JWT_SECRET || "",
  // Cross-site cookies (frontend and API on different domains) need SameSite=None + Secure.
  cookieSameSite: process.env.COOKIE_SAMESITE || (isProd ? "none" : "lax"),
};
