import Section from "../components/common/Section.jsx";
import EnquiryForm from "../components/forms/EnquiryForm.jsx";
import { Async } from "../components/common/Status.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { formatPrice } from "../utils/format.js";

export default function Supplements() {
  const state = useFetch("/api/supplements");
  return (
    <>
      <Section eyebrow="Store" title="Fitness supplements." intro="Enquire for available products and pricing.">
        <Async state={state} empty="The product list is being prepared. Enquire below or visit the gym.">
          {(list) => (
            <div className="t-grid">
              {list.map((p) => (
                <article key={p.id} className="t-card">
                  <h3>{p.productName}</h3>
                  {(p.brand || p.size) && <div className="t-role">{[p.brand, p.size].filter(Boolean).join(", ")}</div>}
                  {p.description && <p className="t-bio">{p.description}</p>}
                  <p style={{ color: "var(--lime)", marginTop: "auto" }}>{formatPrice(p.pricePaise)}</p>
                </article>
              ))}
            </div>
          )}
        </Async>
      </Section>
      <Section alt eyebrow="Enquire" title="Ask about a product.">
        <div className="enquiry" style={{ maxWidth: 640 }}><EnquiryForm defaultType="SUPPLEMENTS" /></div>
      </Section>
    </>
  );
}
