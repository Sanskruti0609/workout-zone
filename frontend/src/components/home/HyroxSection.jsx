import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch.js";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import Reveal from "../common/Reveal.jsx";

export default function HyroxSection() {
  const { data: services } = useFetch("/api/services");
  const hyrox = services?.find((s) => s.slug === "hyrox-training");
  return (
    <section className="hyrox" id="hyrox">
      <div className="container hyrox-inner">
        <Reveal className="hyrox-text">
          <div className="eyebrow">Workout Zone HYROX</div>
          <h2>Built for HYROX.</h2>
          <p className="lead">Push beyond ordinary workouts with focused HYROX training designed around strength, endurance and functional movement.</p>
          <div className="hyrox-pillars"><span>Strength</span><span>Endurance</span><span>Functional movement</span></div>
          <div className="hyrox-info">
            <p>{hyrox?.description || "Ask the team about HYROX sessions, timings and how to get started."}</p>
          </div>
          <Link to="/contact?type=HYROX" className="btn btn-dark">Enquire about HYROX</Link>
          <small>Workout Zone's HYROX training is independent of any official HYROX organisation unless stated otherwise.</small>
        </Reveal>
        <Reveal className="hyrox-visual">
          {hyrox?.imageUrl
            ? <img src={mediaUrl(hyrox.imageUrl, API_BASE)} alt="HYROX training at Workout Zone" loading="lazy" decoding="async" />
            : <ImagePlaceholder label="Photo of the HYROX training area" />}
        </Reveal>
      </div>
    </section>
  );
}
