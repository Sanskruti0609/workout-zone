import { ZodError } from "zod";

export function notFound(_req, res) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    const fields = {};
    for (const issue of err.issues) fields[issue.path.join(".") || "_"] = issue.message;
    return res.status(400).json({ error: "Validation failed", fields });
  }
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });
  if (err.code === "P2025") return res.status(404).json({ error: "Record not found" });
  if (err.code === "P2002") return res.status(409).json({ error: "A record with that name already exists" });
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? "Internal server error" : err.message });
}
