import { DAY_NAMES, formatRange } from "./format.js";

const WEEKDAYS = [1, 2, 3, 4, 5];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const sig = (list) => list.map((t) => `${t.startTime}-${t.endTime}-${t.sessionType}`).join("|");

// Turns the per-day rows from the API into: weekdays (combined when identical), Saturday, Sunday.
export function summariseTimings(timings) {
  const byDay = Array.from({ length: 7 }, (_, d) =>
    timings.filter((t) => t.dayOfWeek === d).sort((a, b) => a.startTime.localeCompare(b.startTime))
  );
  const groups = [];
  for (const d of WEEKDAYS) {
    const s = sig(byDay[d]);
    const last = groups[groups.length - 1];
    if (last && last.sig === s) last.days.push(d);
    else groups.push({ sig: s, days: [d], sessions: byDay[d] });
  }
  const weekdays = groups.map((g) => ({
    label:
      g.days.length === 5 ? "Monday – Friday"
        : g.days.length === 1 ? DAY_NAMES[g.days[0]]
        : `${SHORT[g.days[0]]} – ${SHORT[g.days[g.days.length - 1]]}`,
    sessions: g.sessions,
  }));
  const combined = weekdays.length === 1;
  const ladies = weekdays.flatMap((g) =>
    g.sessions.filter((t) => t.sessionType === "LADIES_ONLY").map((t) => ({ label: g.label, range: formatRange(t.startTime, t.endTime) }))
  );
  const ladiesText = ladies.length === 0 ? null
    : combined ? `${ladies.map((l) => l.range).join(", ")} on weekdays`
    : ladies.map((l) => `${l.label}: ${l.range}`).join(" / ");
  return { weekdays, combined, saturday: byDay[6], sunday: byDay[0], ladiesText };
}
