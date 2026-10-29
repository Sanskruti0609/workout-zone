import { enquirySchema } from "../validators/enquiry.js";
import { createEnquiry } from "../services/enquiryService.js";

export async function submitEnquiry(req, res) {
  const parsed = enquirySchema.parse(req.body ?? {});
  // Bots that fill the hidden field get a fake success and nothing is stored.
  if (parsed.website) return res.status(201).json({ data: { received: true } });
  const enquiry = await createEnquiry(parsed);
  res.status(201).json({ data: { id: enquiry.id, received: true } });
}
