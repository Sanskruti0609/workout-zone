// Decides whether a promotion should be shown again, based on how often the admin allows it.
const DAY = 24 * 60 * 60 * 1000;
const keyFor = (p) => `wz_promo_${p.id}_${new Date(p.updatedAt).getTime()}`;

function store(kind) {
  try { return kind === "session" ? window.sessionStorage : window.localStorage; } catch { return null; }
}

export function shouldShowPromo(promo, now = Date.now()) {
  if (promo.frequency === "EVERY_VISIT") return true;
  const s = store(promo.frequency === "ONCE_PER_SESSION" ? "session" : "local");
  if (!s) return true;
  let seen;
  try { seen = Number(s.getItem(keyFor(promo))); } catch { return true; }
  if (!seen) return true;
  if (promo.frequency === "ONCE_PER_DAY") return now - seen > DAY;
  if (promo.frequency === "ONCE_PER_WEEK") return now - seen > 7 * DAY;
  return false; // ONCE and ONCE_PER_SESSION
}

export function markPromoSeen(promo, now = Date.now()) {
  if (promo.frequency === "EVERY_VISIT") return;
  const s = store(promo.frequency === "ONCE_PER_SESSION" ? "session" : "local");
  try { s?.setItem(keyFor(promo), String(now)); } catch { /* storage unavailable: show again next time */ }
}
