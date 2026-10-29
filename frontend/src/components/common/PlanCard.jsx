import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/format.js";
import Icon from "./Icon.jsx";

export default function PlanCard({ plan }) {
  const hasPrice = plan.pricePaise != null;
  return (
    <article className="plan">
      <div className="plan-name">{plan.name}</div>
      <div className={`plan-price ${hasPrice ? "" : "ask"}`}>{formatPrice(plan.pricePaise)}</div>
      <div className="plan-note">{plan.durationMonths} {plan.durationMonths === 1 ? "month" : "months"}</div>
      {plan.benefits?.length > 0 && (
        <ul className="plan-feats">
          {plan.benefits.map((b) => <li key={b}><Icon name="check" strokeWidth={2} />{b}</li>)}
        </ul>
      )}
      <Link to="/contact?type=MEMBERSHIP" className="btn btn-outline btn-block">Enquire now</Link>
    </article>
  );
}
