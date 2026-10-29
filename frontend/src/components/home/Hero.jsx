import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch.js";
import HeroPlate from "./HeroPlate.jsx";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { data: business } = useFetch("/api/business");
  useEffect(() => { const t = requestAnimationFrame(() => setLoaded(true)); return () => cancelAnimationFrame(t); }, []);
  return (
    <section className={`hz-hero ${loaded ? "loaded" : ""}`} id="home">
      <div className="hz-bg" aria-hidden="true" />
      <div className="container hz-inner">
        <HeroPlate />
        <div className="hz-copy">
          <div className="eyebrow">Parel, Mumbai</div>
          <h1>
            <span className="hz-line"><span>Your goals.</span></span>
            <span className="hz-line"><span>Your grind.</span></span>
            <span className="hz-line"><span>Your zone.</span></span>
          </h1>
          <p className="hz-sub">
            Build strength, improve endurance and transform your fitness journey at Workout Zone, Parel.
          </p>
          <div className="hz-actions">
            <Link to="/memberships" className="btn btn-primary">Explore memberships</Link>
            <Link to="/#hyrox" className="hz-link">Discover HYROX</Link>
          </div>
          <div className="hz-tags">
            <span className="tag">Strength</span><span className="tag">Yoga</span><span className="tag">Zumba</span><span className="tag">HYROX</span>
            {business?.googleRating ? <span className="tag">{business.googleRating}/5 on Google</span> : null}
          </div>
        </div>
      </div>
      <div className="hz-cue" aria-hidden="true" />
    </section>
  );
}
