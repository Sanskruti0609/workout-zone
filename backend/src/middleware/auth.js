import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const COOKIE_NAME = "wz_admin";
export const SESSION_HOURS = 8;
const CSRF_HEADER_VALUE = "WorkoutZoneAdmin";

export const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.cookieSameSite,
  path: "/",
});

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: `${SESSION_HOURS}h` }
  );
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const p = jwt.verify(token, env.jwtSecret);
    req.user = { id: p.sub, name: p.name, email: p.email, role: p.role };
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

// CSRF defence: a browser cannot send this custom header cross-site without a CORS preflight,
// and CORS only allows our own frontend origin.
export function requireCsrfHeader(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("x-requested-with") !== CSRF_HEADER_VALUE) {
    return res.status(403).json({ error: "Missing required request header" });
  }
  next();
}

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) return res.status(403).json({ error: "You do not have permission to do this" });
  next();
};
