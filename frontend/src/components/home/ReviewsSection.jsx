import { useRef } from "react";
import { useFetch } from "../../hooks/useFetch.js";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";
import Icon from "../common/Icon.jsx";
import Section from "../common/Section.jsx";

export function Stars({ rating }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= rating ? "" : "off"} aria-hidden="true">★</span>)}
    </span>
  );
}

export default function ReviewsSection() {
  const { data: reviews } = useFetch("/api/testimonials");
  const { data: business } = useFetch("/api/business");
  const scroller = useRef(null);
  const scrollBy = (dir) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.8, behavior: "smooth" });
  const hasReviews = reviews?.length > 0;
  if (!hasReviews && !business?.googleRating) return <span id="reviews" />;

  return (
    <Section id="reviews" eyebrow="Reviews" title="What members say.">
      {business?.googleRating ? (
        <p className="rev-score" style={{ marginTop: 0, marginBottom: 24 }}>
          <b>{business.googleRating}</b> out of 5 on Google{business.reviewCount ? `, from ${business.reviewCount} reviews` : ""}
        </p>
      ) : null}
      {hasReviews && (
        <div className="rev-wrap">
          <div className="rev-scroll" ref={scroller} tabIndex={0} role="region" aria-label="Customer reviews, scroll sideways">
            {reviews.map((r) => (
              <figure key={r.id} className="rev-card" style={{ margin: 0 }}>
                {r.rating ? <Stars rating={r.rating} /> : null}
                <blockquote>{r.quote}</blockquote>
                <figcaption className="rev-who">
                  {r.photoUrl
                    ? <img className="rev-avatar" src={mediaUrl(r.photoUrl, API_BASE)} alt="" loading="lazy" decoding="async" />
                    : <span className="rev-avatar" aria-hidden="true">{r.displayName[0].toUpperCase()}</span>}
                  <span className="rev-name">{r.displayName}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {reviews.length > 1 && (
            <div className="rev-nav">
              <button type="button" className="lb-btn" aria-label="Previous reviews" onClick={() => scrollBy(-1)}><Icon name="left" /></button>
              <button type="button" className="lb-btn" aria-label="Next reviews" onClick={() => scrollBy(1)}><Icon name="right" /></button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
