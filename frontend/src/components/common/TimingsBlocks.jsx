import { DAY_NAMES, formatTime } from "../../utils/format.js";

function Block({ t }) {
  const ladies = t.sessionType === "LADIES_ONLY";
  return (
    <div className={`rounded-xl border p-5 ${ladies ? "border-pink-400 bg-pink-950/40" : "border-neutral-700 bg-neutral-900"}`}>
      <p className="text-lg font-bold">{formatTime(t.startTime)} to {formatTime(t.endTime)}</p>
      <p className={ladies ? "text-pink-300" : "text-orange-500"}>{ladies ? "Ladies-only" : "Unisex"}</p>
    </div>
  );
}

export default function TimingsBlocks({ timings }) {
  const byDay = DAY_NAMES.map((_, d) => timings.filter((t) => t.dayOfWeek === d));
  const sig = (list) => list.map((t) => `${t.startTime}-${t.endTime}-${t.sessionType}`).join("|");
  const allSame = byDay.every((l) => sig(l) === sig(byDay[0]));

  if (allSame) {
    return (
      <div>
        <p className="mb-4 text-neutral-400">Every day</p>
        <div className="grid gap-4 md:grid-cols-3">{byDay[0].map((t) => <Block key={t.id} t={t} />)}</div>
      </div>
    );
  }
  return (
    <div className="grid gap-8">
      {byDay.map((list, d) => list.length > 0 && (
        <div key={d}>
          <p className="mb-3 font-semibold">{DAY_NAMES[d]}</p>
          <div className="grid gap-4 md:grid-cols-3">{list.map((t) => <Block key={t.id} t={t} />)}</div>
        </div>
      ))}
    </div>
  );
}
