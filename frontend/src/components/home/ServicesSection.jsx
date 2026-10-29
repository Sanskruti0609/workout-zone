import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch.js";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import Reveal from "../common/Reveal.jsx";
import Section from "../common/Section.jsx";
import { Async } from "../common/Status.jsx";

export default function ServicesSection() {
  const state = useFetch("/api/services?featured=true");
  return (
    <Section id="services" eyebrow="Services" title="Train your way." intro="Strength, yoga and Zumba. Pick a lane, or try them all.">
      <Async state={state} empty="Services will appear here soon.">
        {(list) => (
          <Reveal stagger className="svc-grid three">
            {list.map((s) => (
              <article key={s.id} className="svc-card has-media">
                <div className="svc-media">
                  {s.imageUrl
                    ? <img src={mediaUrl(s.imageUrl, API_BASE)} alt={s.name} loading="lazy" decoding="async" />
                    : <ImagePlaceholder label={`Photo for ${s.name}`} />}
                </div>
                <div className="svc-body">
                  <h3>{s.name}</h3>
                  {s.description && <p>{s.description}</p>}
                  <Link to="/contact" className="tag">Enquire</Link>
                </div>
              </article>
            ))}
          </Reveal>
        )}
      </Async>
    </Section>
  );
}
