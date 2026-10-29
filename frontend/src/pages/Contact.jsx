import { useSearchParams } from "react-router-dom";
import Section from "../components/common/Section.jsx";
import ContactBlock from "../components/common/ContactBlock.jsx";
import EnquiryForm from "../components/forms/EnquiryForm.jsx";

const TYPES = ["MEMBERSHIP", "HYROX", "YOGA", "SUPPLEMENTS", "STEAM_MASSAGE", "LADIES_SESSIONS", "GENERAL"];

export default function Contact() {
  const [params] = useSearchParams();
  const type = TYPES.includes(params.get("type")) ? params.get("type") : "GENERAL";
  return (
    <Section eyebrow="Get in touch" title="Contact.">
      <div className="contact-grid">
        <ContactBlock />
        <div className="enquiry"><EnquiryForm key={type} defaultType={type} /></div>
      </div>
    </Section>
  );
}
