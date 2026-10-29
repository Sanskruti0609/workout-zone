import { useEffect, useRef, useState } from "react";

// The hero's one dominant visual: a weight plate carrying the gym emblem, built from plain CSS 3D
// (no extra libraries). Phones get fewer layers and no pointer tracking; reduced-motion gets a still pose.
const mq = (q) => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q) : null);

function Face({ uid, back = false }) {
  return (
    <div className={`hz-face ${back ? "back" : "front"}`} aria-hidden="true">
      <svg viewBox="0 0 400 400" focusable="false">
        <defs>
          <radialGradient id={`m${uid}`} cx="36%" cy="28%" r="85%">
            <stop offset="0" stopColor="#4b4e4b" />
            <stop offset=".5" stopColor="#292B29" />
            <stop offset="1" stopColor="#141514" />
          </radialGradient>
          <clipPath id={`c${uid}`}><circle cx="200" cy="200" r="118" /></clipPath>
        </defs>
        <circle cx="200" cy="200" r="198" fill={`url(#m${uid})`} />
        <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="2" />
        <circle cx="200" cy="200" r="174" fill="none" stroke="rgba(0,0,0,.55)" strokeWidth="4" />
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="141" fill="none" stroke="#A6F238" strokeWidth="2.5" opacity=".9" />
        <circle cx="200" cy="200" r="134" fill="#101110" />
        <image href="/workout_zone_logo.png" x="82" y="82" width="236" height="236" clipPath={`url(#c${uid})`} preserveAspectRatio="xMidYMid slice" />
        <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
      </svg>
      <span className="hz-sheen" />
    </div>
  );
}

export default function HeroPlate() {
  const stage = useRef(null);
  const [layers, setLayers] = useState(() => (mq("(max-width: 899px)")?.matches ? 7 : 13));

  useEffect(() => {
    const small = mq("(max-width: 899px)");
    const onSize = () => setLayers(small.matches ? 7 : 13);
    small?.addEventListener?.("change", onSize);
    return () => small?.removeEventListener?.("change", onSize);
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const reduce = mq("(prefers-reduced-motion: reduce)")?.matches;
    const finePointer = mq("(hover: hover) and (pointer: fine)")?.matches;

    // Pause every animation while the hero is off screen or the tab is hidden.
    let visible = true;
    const sync = () => el.classList.toggle("paused", !visible || document.hidden);
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
      io.observe(el);
    }
    document.addEventListener("visibilitychange", sync);

    // Gentle pointer parallax, smoothed in requestAnimationFrame. Desktop with a real pointer only.
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const tick = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
      raf = Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e) => {
      if (!visible) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    if (finePointer && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const slices = Array.from({ length: layers }, (_, i) => i / (layers - 1) - 0.5);
  return (
    <div className="hz-stage" ref={stage} aria-hidden="true">
      <div className="hz-halo" />
      <div className="hz-sweep" />
      <div className="hz-floor" />
      <div className="hz-enter">
        <div className="hz-tilt">
          <div className="hz-float">
            <div className="hz-spin">
              <div className="hz-plate">
                {slices.map((z, i) => (
                  <span key={i} className={`hz-slice ${Math.abs(z) < 0.001 ? "seam" : ""} ${i % 2 ? "alt" : ""}`} style={{ "--z": z }} />
                ))}
                <Face uid="f" />
                <Face uid="b" back />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hz-veil" />
    </div>
  );
}
