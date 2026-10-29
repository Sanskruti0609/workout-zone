import { Router } from "express";
import * as c from "../controllers/publicController.js";

const router = Router();
router.get("/business", c.business);
router.get("/trainers", c.trainers);
router.get("/services", c.services);
router.get("/memberships", c.memberships);
router.get("/timings", c.timings);
router.get("/supplements", c.supplements);
router.get("/testimonials", c.testimonials);
router.get("/gallery", c.gallery);
router.get("/promotions/active", c.activePromotion);
export default router;
