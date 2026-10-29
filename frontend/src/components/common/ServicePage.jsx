import { useFetch } from "../../hooks/useFetch.js";
import { API_BASE } from "../../services/api.js";
import { formatPrice, mediaUrl } from "../../utils/format.js";
import Section from "./Section.jsx";
import ImagePlaceholder from "./ImagePlaceholder.jsx";
import EnquiryForm from "../forms/EnquiryForm.jsx";
import { Async } from "./Status.jsx";

// Renders one or more services from the API. Descriptions are editable by the admin.
export default function ServicePage({ title, slugs, enquiryType, imageLabel, note }) {
  const state = useFetch("/api/services");
  return (
    <>
      <Section eyebrow="Workout Zone" title={title}>
        <div className="contact-grid">
          <Async state={state}>
            {(all) => {
              const mine = all.filter((s) => slugs.includes(s.slug));
              const photo = mine.find((s) => s.imageUrl)?.imageUrl;
              return (
                <>
                  {photo ? <img src={mediaUrl(photo, API_BASE)} alt={title} style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", border: "1px solid var(--line)" }} loading="lazy" decoding="async" />
                    : <ImagePlaceholder label={imageLabel} style={{ aspectRatio: "16 / 10" }} />}
                  <div>
                    {mine.map((s) => (
                      <div key={s.id} style={{ marginBottom: 24 }}>
                        <h3 style={{ fontSize: 26 }}>{s.name}</h3>
                        <p className="muted" style={{ marginTop: 8 }}>{s.description || "Details for this service are being finalised. Please enquire or visit the gym."}</p>
                        {s.pricePaise != null && <p style={{ marginTop: 8, color: "var(--lime)" }}>{formatPrice(s.pricePaise)}</p>}
                      </div>
                    ))}
                    {note && <p className="muted" style={{ fontSize: 13 }}>{note}</p>}
                  </div>
                </>
              );
            }}
          </Async>
        </div>
      </Section>
      <Section alt eyebrow="Enquire" title="Ask the team.">
        <div className="enquiry" style={{ maxWidth: 640 }}><EnquiryForm defaultType={enquiryType} /></div>
      </Section>
    </>
  );
}
