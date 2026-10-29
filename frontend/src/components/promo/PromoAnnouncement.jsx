import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../services/api.js";
import { formatDateRange, mediaUrl } from "../../utils/format.js";

const THEME_EMOJIS = {
  DEFAULT: "",
  DIWALI: "🪔✨🪔",
  VALENTINES: "💖🎁💖",
  NEW_YEAR: "🎆🥳🎆",
  GANESH_CHATURTHI: "🙏🌺🙏",
  ANNIVERSARY: "🎉🏆🎉",
};

function Cta({ promo, onNavigate, className }) {
  if (!promo.ctaText) return null;
  const url = promo.ctaUrl || "/contact";
  if (url.startsWith("/")) return <Link to={url} className={className} onClick={onNavigate}>{promo.ctaText}</Link>;
  const external = url.startsWith("https://");
  return <a href={url} className={className} onClick={onNavigate} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{promo.ctaText}</a>;
}

function Body({ promo, headingId }) {
  const emojis = promo.emojis || THEME_EMOJIS[promo.theme] || "";
  return (
    <>
      {promo.imageUrl && <img className="promo-img" src={mediaUrl(promo.imageUrl, API_BASE)} alt="" decoding="async" />}
      <div className="promo-body">
        {emojis && <div className="promo-emojis" aria-hidden="true">{emojis}</div>}
        <h2 id={headingId}>{promo.title}</h2>
        {promo.description && <p className="desc">{promo.description}</p>}
        {promo.startsAt && promo.endsAt && <span className="valid">Valid {formatDateRange(promo.startsAt, promo.endsAt)}</span>}
        <Cta promo={promo} className="btn btn-promo" onNavigate={promo.__onNavigate} />
        {promo.terms && <details><summary>Terms and conditions</summary><p>{promo.terms}</p></details>}
      </div>
    </>
  );
}

// format: POPUP (modal), BANNER (top bar) or CARD (in-page). `onClose` hides it; `preview` is used by the admin.
export default function PromoAnnouncement({ promo, onClose, preview = false }) {
  const closeRef = useRef(null);
  const isPopup = promo.format === "POPUP" || !promo.format;
  const withNav = { ...promo, __onNavigate: onClose };

  useEffect(() => {
    if (!isPopup || preview) return;
    const prev = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; prev?.focus?.(); };
  }, [isPopup, preview, onClose]);

  const closeBtn = <button ref={closeRef} type="button" className="promo-close" aria-label="Close announcement" onClick={onClose}>×</button>;

  if (promo.format === "BANNER") {
    const emojis = promo.emojis || THEME_EMOJIS[promo.theme] || "";
    return (
      <div className="promo-banner" role="region" aria-label="Announcement">
        {emojis && <span aria-hidden="true">{emojis.split(/(?=\p{Extended_Pictographic})/u)[0]}</span>}
        <strong>{promo.title}</strong>
        {promo.description && <span>{promo.description}</span>}
        <Cta promo={promo} onNavigate={onClose} />
        {closeBtn}
      </div>
    );
  }
  if (promo.format === "CARD") {
    return (
      <div className="promo-card-wrap"><div className="container">
        <section className="promo card" aria-labelledby="promo-title">
          {closeBtn}<Body promo={withNav} headingId="promo-title" />
        </section>
      </div></div>
    );
  }
  const dialog = (
    <section className="promo" role="dialog" aria-modal="true" aria-labelledby="promo-title" onClick={(e) => e.stopPropagation()}>
      {closeBtn}<Body promo={withNav} headingId="promo-title" />
    </section>
  );
  return preview ? <div className="promo-backdrop" style={{ position: "static", background: "transparent", padding: 0, backdropFilter: "none" }}>{dialog}</div>
    : <div className="promo-backdrop" onClick={onClose}>{dialog}</div>;
}
