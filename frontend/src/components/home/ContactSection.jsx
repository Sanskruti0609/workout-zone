import ContactBlock from "../common/ContactBlock.jsx";
import EnquiryForm from "../forms/EnquiryForm.jsx";
import Reveal from "../common/Reveal.jsx";
import Section from "../common/Section.jsx";

export default function ContactSection() {
  return (
    <Section id="contact" eyebrow="Get in touch" title="Let's get you moving." intro="Send an enquiry and the team will contact you.">
      <div className="contact-grid">
        <Reveal><ContactBlock /></Reveal>
        <Reveal className="enquiry"><h3>Quick enquiry</h3><p className="hint">Tell us what you're interested in.</p><EnquiryForm /></Reveal>
      </div>
    </Section>
  );
}
