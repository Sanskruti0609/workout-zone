import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env.js";
import { HttpError } from "../utils/httpError.js";

const MAX_BYTES = 60 * 1024 * 1024; // videos
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

// The browser-declared type can be faked, so also check the file's real signature.
function matchesSignature(mime, b) {
  const ascii = (from, to) => b.subarray(from, to).toString("latin1");
  switch (mime) {
    case "image/jpeg": return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    case "image/png": return b[0] === 0x89 && ascii(1, 4) === "PNG";
    case "image/webp": return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
    case "video/mp4": return ascii(4, 8) === "ftyp";
    case "video/webm": return b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
    default: return false;
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(env.uploadDir, { recursive: true });
    cb(null, env.uploadDir);
  },
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}.${EXT[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) =>
    EXT[file.mimetype] ? cb(null, true) : cb(new HttpError(400, "Only JPG, PNG, WebP, MP4 or WebM files are allowed")),
});

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 100, message: { error: "Too many uploads. Try again later." } });

const router = Router();

// Admin-only: the parent admin router already requires a login and the CSRF header.
router.post("/", limiter, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err?.code === "LIMIT_FILE_SIZE") return next(new HttpError(400, "File is too large (maximum 60 MB)"));
    if (err) return next(err);
    if (!req.file) return next(new HttpError(400, "No file received"));

    const { path: filePath, mimetype, size, filename } = req.file;
    const fail = (message) => {
      fs.rmSync(filePath, { force: true });
      next(new HttpError(400, message));
    };

    const head = Buffer.alloc(16);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, head, 0, 16, 0);
    fs.closeSync(fd);

    if (!matchesSignature(mimetype, head)) return fail("The file content does not match its type");
    if (mimetype.startsWith("image/") && size > MAX_IMAGE_BYTES) return fail("Images must be 8 MB or smaller");

    res.status(201).json({
      data: { url: `/uploads/${filename}`, mediaType: mimetype.startsWith("video/") ? "VIDEO" : "IMAGE", size },
    });
  });
});

export default router;
