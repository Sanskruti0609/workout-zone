export function formatPrice(paise) {
  if (paise == null) return "Contact for Pricing";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function mapsLink(business) {
  if (business?.mapUrl) return business.mapUrl;
  const q = encodeURIComponent(`${business?.name ?? "Workout Zone"}, ${business?.address ?? "Parel East, Mumbai"}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export const telHref = (phone) => `tel:${(phone || "").replace(/[^+\d]/g, "")}`;

export const formatRange = (start, end) => `${formatTime(start)} – ${formatTime(end)}`;

// Files uploaded in the admin dashboard are served by the API; project images are served by the site.
export function mediaUrl(url, apiBase) {
  if (!url) return url;
  return url.startsWith("/uploads/") ? `${apiBase}${url}` : url;
}

export function formatDateRange(startsAt, endsAt) {
  const opts = { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" };
  const f = (d) => new Date(d).toLocaleDateString("en-IN", opts);
  return `${f(startsAt)} – ${f(endsAt)}`;
}
