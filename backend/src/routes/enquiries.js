import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitEnquiry } from "../controllers/enquiryController.js";

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: { error: "Too many enquiries from this connection. Please try again later." },
});

const router = Router();
router.post("/", limiter, submitEnquiry);
export default router;
