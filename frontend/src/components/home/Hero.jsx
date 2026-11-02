import { useEffect, useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch.js";
import Icon from "../common/Icon.jsx";
import HeroPlate from "./HeroPlate.jsx";

// Centered hero: a glowing 3D plate behind the headline, with quiet side details.
// While the page scrolls, --p (0 to 1) drives a gentle parallax: text lifts and fades, the plate turns and grows.
export default function Hero() {
  const root = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const { data: services } = useFetch("/api/services");
  // Only a number the gym's own data backs up: active services filed under "Training".
  const trainingCount = Array.isArray(services)
    ? services.filter((s) => (s.category || "").toLowerCase() === "training").length
    : 0;

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const span = (el.offsetHeight || window.innerHeight) * 0.9;
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} className={`hz-hero ${loaded ? "loaded" : ""}`} id="home">
      <div className="hz-bg" aria-hidden="true" />
      <HeroPlate />
      <div className="hz-scrim" aria-hidden="true" />

      <div className="hz-side hz-vtag" aria-hidden="true">
        <span className="hz-vline short" />
        <p>Train<i />Move<i />Grow</p>
        <span className="hz-vline" />
      </div>
      <div className="hz-side hz-est" aria-hidden="true"><span>Est. Parel</span></div>

      <div className="container hz-copy">
        <div className="eyebrow hz-fade">Parel, Mumbai</div>
        <h1>
          <span className="hz-line"><span>Your goals.</span></span>
          <span className="hz-line"><span>Your grind.</span></span>
          <span className="hz-line"><span>Your zone.</span></span>
        </h1>
        <p className="hz-sub hz-fade">
          Build strength, improve endurance and transform your fitness journey at Workout Zone, Parel.
        </p>
      </div>

      <ul className="hz-side hz-chips" aria-label="Highlights">
        {trainingCount > 0 && (
          <li className="hz-chip"><div className="in"><b>{trainingCount}</b><span>Training<br />options</span></div></li>
        )}
        <li className="hz-chip"><div className="in"><Icon name="users" /><span>One strong<br />community</span></div></li>
      </ul>
    </section>
  );
}