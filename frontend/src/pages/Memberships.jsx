import Section from "../components/common/Section.jsx";
import PlanCard from "../components/common/PlanCard.jsx";
import EnquiryForm from "../components/forms/EnquiryForm.jsx";
import { Async } from "../components/common/Status.jsx";
import { useFetch } from "../hooks/useFetch.js";

export default function Memberships() {
  const state = useFetch("/api/memberships");
  return (
    <>
      <Section eyebrow="Join us" title="Memberships.">
        <Async state={state} empty="Membership plans will be published soon.">
          {(list) => <div className="plans cols">{list.map((p) => <PlanCard key={p.id} plan={p} />)}</div>}
        </Async>
      </Section>
      <Section alt eyebrow="Enquire" title="Ask about a plan.">
        <div className="enquiry" style={{ maxWidth: 640 }}><EnquiryForm defaultType="MEMBERSHIP" /></div>
      </Section>
    </>
  );
}
