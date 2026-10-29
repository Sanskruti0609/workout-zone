import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.js";
import publicRouter from "./routes/public.js";
import enquiriesRouter from "./routes/enquiries.js";
import adminRouter from "./routes/admin.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
if (env.isProd) app.set("trust proxy", 1); // needed behind Render/Railway for correct IPs and secure cookies
app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
if (env.nodeEnv !== "test") app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
// Admin-uploaded media. nosniff stops browsers treating a file as anything but its declared type.
app.use("/uploads", express.static(env.uploadDir, {
  index: false,
  dotfiles: "deny",
  maxAge: "7d",
  setHeaders: (res) => {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    res.set("X-Content-Type-Options", "nosniff");
  },
}));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.use("/api/health", healthRouter);
app.use("/api", publicRouter);
app.use("/api/enquiries", enquiriesRouter);
app.use("/api/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
