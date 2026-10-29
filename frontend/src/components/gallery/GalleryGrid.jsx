import { useState } from "react";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";
import Icon from "../common/Icon.jsx";
import Lightbox from "./Lightbox.jsx";

export default function GalleryGrid({ items, initialCount = 6 }) {
  const [open, setOpen] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? items : items.slice(0, initialCount);
  return (
    <>
      <div className="gal-grid">
        {shown.map((it, i) => (
          <button key={it.id} type="button" className="gal-tile" onClick={() => setOpen(i)} aria-label={`${it.mediaType === "VIDEO" ? "Play video" : "View photo"}${it.caption ? `: ${it.caption}` : ""}`}>
            {it.mediaType === "VIDEO"
              ? (it.posterUrl
                  ? <img src={mediaUrl(it.posterUrl, API_BASE)} alt="" loading="lazy" decoding="async" />
                  : <div className="gal-video-bg" />)
              : <img src={mediaUrl(it.url, API_BASE)} alt="" loading="lazy" decoding="async" />}
            {it.mediaType === "VIDEO" && <span className="gal-play"><Icon name="play" strokeWidth={2} /></span>}
            {it.caption && <span className="gal-cap">{it.caption}</span>}
          </button>
        ))}
      </div>
      {items.length > initialCount && !showAll && (
        <div className="gal-more"><button type="button" className="btn btn-outline" onClick={() => setShowAll(true)}>Show all {items.length}</button></div>
      )}
      {open != null && <Lightbox items={shown} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </>
  );
}
