import { Router } from "express";
import prisma from "../config/prisma.js";
import { requireRole } from "../middleware/auth.js";
import { HttpError } from "../utils/httpError.js";

const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Invalid id");
  return id;
};

// Generic list / create / update (and optional delete) for a Prisma model.
export function crudRouter({ model, schema, updateSchema, orderBy, allowDelete = false, validate }) {
  const router = Router();
  const table = () => prisma[model];

  router.get("/", async (_req, res) => res.json({ data: await table().findMany({ orderBy }) }));

  router.post("/", async (req, res) => {
    const data = schema.parse(req.body ?? {});
    validate?.(data);
    res.status(201).json({ data: await table().create({ data }) });
  });

  // Updates accept a partial body, so "deactivate" is just { "isActive": false }.
  router.patch("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    const base = updateSchema ?? schema.partial();
    const data = base.parse(req.body ?? {});
    validate?.(data);
    res.json({ data: await table().update({ where: { id }, data }) });
  });

  if (allowDelete) {
    router.delete("/:id", requireRole("ADMIN"), async (req, res) => {
      await table().delete({ where: { id: parseId(req.params.id) } });
      res.status(204).end();
    });
  }
  return router;
}
