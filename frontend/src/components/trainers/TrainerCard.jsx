import { Link } from "react-router-dom";
import { API_BASE } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

export default function TrainerCard({ trainer }) {
  return (
    <article className={`t-card ${trainer.isMainTrainer ? "main" : ""}`}>
      <div className="t-avatar">
        {trainer.imageUrl
          ? <img src={mediaUrl(trainer.imageUrl, API_BASE)} alt={trainer.name} loading="lazy" decoding="async" />
          : <span className="initials" aria-hidden="true">{initials(trainer.name)}</span>}
      </div>
      <h3>{trainer.name}</h3>
      {trainer.role && <div className="t-role">{trainer.role}</div>}
      {trainer.bio && <p className="t-bio">{trainer.bio}</p>}
      <div className="t-foot"><Link to="/contact" className="tag">Train with us</Link></div>
    </article>
  );
}
