import { useEffect, useRef } from "react";

// One quiet fade-up as a block scrolls into view. Without IntersectionObserver it shows immediately.
export default function Reveal({ as: Tag = "div", className = "", stagger = false, children, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { el.classList.add("in"); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`${stagger ? "reveal-stag" : "reveal"} ${className}`} {...rest}>{children}</Tag>;
}
