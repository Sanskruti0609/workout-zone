import { useCallback, useEffect, useRef } from "react";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";
import Icon from "../common/Icon.jsx";

// Full-screen viewer: Esc closes, arrow keys / swipe / buttons move between items.
export default function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index];
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const go = useCallback((d) => onChange((index + d + items.length) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; prev?.focus?.(); };
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  if (!item) return null;
  const src = mediaUrl(item.url, API_BASE);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label="Gallery viewer">
      <div className="lb-top">
        <span>{index + 1} / {items.length}</span>
        <button ref={closeRef} type="button" className="lb-btn" aria-label="Close viewer" onClick={onClose}>×</button>
      </div>
      <div
        className="lb-stage"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50 && items.length > 1) go(dx < 0 ? 1 : -1);
        }}
      >
        {item.mediaType === "VIDEO"
          ? <video key={item.id} src={src} poster={mediaUrl(item.posterUrl, API_BASE) || undefined} controls playsInline preload="metadata" />
          : <img key={item.id} src={src} alt={item.caption || "Workout Zone equipment"} decoding="async" />}
        {items.length > 1 && (
          <>
            <button type="button" className="lb-btn lb-prev" aria-label="Previous" onClick={() => go(-1)}><Icon name="left" /></button>
            <button type="button" className="lb-btn lb-next" aria-label="Next" onClick={() => go(1)}><Icon name="right" /></button>
          </>
        )}
      </div>
      <div className="lb-cap">{item.caption}</div>
    </div>
  );
}
