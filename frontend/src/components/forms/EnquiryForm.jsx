import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../services/api.js";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name"),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, "Please enter a valid phone number"),
  email: z.string().trim().email("Please enter a valid email").or(z.literal("")).optional(),
  enquiryType: z.string(),
  preferredVisitTime: z.string().max(100).optional(),
  message: z.string().max(1000, "Please keep the message under 1000 characters").optional(),
  website: z.string().optional(),
});

const TYPES = [
  ["MEMBERSHIP", "Membership"],
  ["HYROX", "HYROX training"],
  ["YOGA", "Yoga"],
  ["SUPPLEMENTS", "Supplements"],
  ["STEAM_MASSAGE", "Steam / Massage"],
  ["LADIES_SESSIONS", "Ladies-only sessions"],
  ["GENERAL", "General enquiry"],
];


export default function EnquiryForm({ defaultType = "GENERAL" }) {
  const [result, setResult] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { enquiryType: defaultType },
  });

  async function onSubmit(values) {
    setResult(null);
    try {
      await api("/api/enquiries", { method: "POST", body: JSON.stringify(values) });
      setResult({ ok: true, text: "Thank you! Your enquiry has been received. The gym will contact you." });
      reset({ enquiryType: defaultType });
    } catch (e) {
      setResult({ ok: false, text: `We could not send your enquiry (${e.message}). Please call the gym instead.` });
    }
  }

  const err = (name) => errors[name] && <p className="err" role="alert">{errors[name].message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" {...register("fullName")} />
        {err("fullName")}
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" type="tel" {...register("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" {...register("email")} />
          {err("email")}
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="enquiryType">Enquiry about</label>
          <select id="enquiryType" {...register("enquiryType")}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="preferredVisitTime">Preferred visit time (optional)</label>
          <input id="preferredVisitTime" {...register("preferredVisitTime")} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">Message (optional)</label>
        <textarea id="message" rows={4} {...register("message")} />
        {err("message")}
      </div>
      <div style={{ display: "none" }} aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <button disabled={isSubmitting} className="btn btn-primary btn-block">
        {isSubmitting ? "Sending..." : "Send enquiry"}
      </button>
      {result && <p role="status" className={result.ok ? "ok" : "err"}>{result.text}</p>}
    </form>
  );
}
