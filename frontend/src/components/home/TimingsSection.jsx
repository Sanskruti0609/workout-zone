import { useFetch } from "../../hooks/useFetch.js";
import { formatRange } from "../../utils/format.js";
import { summariseTimings } from "../../utils/timings.js";
import Reveal from "../common/Reveal.jsx";
import Section from "../common/Section.jsx";
import { Async } from "../common/Status.jsx";

function DayCard({ title, sub, sessions }) {
  return (
    <article className="tm-card">
      <h3>{title}</h3>
      {sub && <p className="sub">{sub}</p>}
      {sessions.length === 0 ? <p className="muted">Timings not set yet. Please call the gym.</p> : sessions.map((t) => (
        <div className="tm-row" key={t.id ?? `${t.startTime}-${t.endTime}`}>
          <span className="tm-time">{formatRange(t.startTime, t.endTime)}</span>
          <span className={`tm-tag ${t.sessionType === "LADIES_ONLY" ? "ladies" : ""}`}>{t.sessionType === "LADIES_ONLY" ? "Ladies only" : "Unisex"}</span>
        </div>
      ))}
    </article>
  );
}

export function TimingsView({ timings }) {
  const s = summariseTimings(timings);
  return (
    <>
      <div className="tm-grid">
        {s.weekdays.map((g) => <DayCard key={g.label} title={g.label} sub={s.combined ? "Same schedule every weekday" : null} sessions={g.sessions} />)}
        <DayCard title="Saturday" sessions={s.saturday} />
        <DayCard title="Sunday" sessions={s.sunday} />
      </div>
      {s.ladiesText && <div className="tm-note"><b>Ladies-only hours</b><span>{s.ladiesText}</span></div>}
    </>
  );
}

export default function TimingsSection({ page = false }) {
  const state = useFetch("/api/timings");
  return (
    <Section id="timings" eyebrow="Gym hours" title="Timings" alt={!page}>
      <Async state={state} empty="Timings will be published soon. Please call the gym.">
        {(list) => <Reveal><TimingsView timings={list} /></Reveal>}
      </Async>
    </Section>
  );
}
