import ResourcePage from "./ResourcePage.jsx";
import PromoAnnouncement from "../../components/promo/PromoAnnouncement.jsx";
import { Stars } from "../../components/home/ReviewsSection.jsx";
import { DAY_NAMES, formatPrice, formatTime } from "../../utils/format.js";

const imageHelp = "Optional. Use a /images/... path for a file in the project, or an https:// link. Only approved photos.";
const priceCol = { label: "Price", render: (i) => formatPrice(i.pricePaise) };
const activeCol = { label: "Status", render: (i) => (i.isActive ? "Active" : "Inactive") };

export const Trainers = () => (
  <ResourcePage title="Trainers" itemName="trainer" endpoint="trainers"
    columns={[{ label: "Order", key: "displayOrder" }, { label: "Name", key: "name" }, { label: "Role", key: "role" }, { label: "Gender", key: "gender" }, activeCol]}
    fields={[
      { name: "name", label: "Name" }, { name: "role", label: "Role (e.g. Main Trainer)" },
      { name: "gender", label: "Gender category", type: "select", options: [["MALE", "Male trainers"], ["FEMALE", "Female trainers"]] },
      { name: "isMainTrainer", label: "Main (featured) trainer", type: "checkbox", default: false },
      { name: "bio", label: "Biography", type: "textarea", help: "Only add verified information." },
      { name: "imageUrl", label: "Photo", help: imageHelp },
      { name: "displayOrder", label: "Display order (lower shows first)", type: "number", default: 0 },
      { name: "isActive", label: "Published", type: "checkbox" },
    ]} />
);

export const Services = () => (
  <ResourcePage title="Services" itemName="service" endpoint="services"
    columns={[{ label: "Order", key: "displayOrder" }, { label: "Name", key: "name" }, { label: "Category", key: "category" }, priceCol, activeCol]}
    fields={[
      { name: "name", label: "Name" }, { name: "slug", label: "Slug", help: "Lowercase with dashes. Changing it may break page links." },
      { name: "category", label: "Category" }, { name: "description", label: "Description", type: "textarea" },
      { name: "pricePaise", label: "Price in rupees (leave blank if not supplied)", type: "rupees" },
      { name: "imageUrl", label: "Photo", help: imageHelp },
      { name: "isFeatured", label: "Show on the homepage Services section", type: "checkbox", default: false },
      { name: "displayOrder", label: "Display order", type: "number", default: 0 },
      { name: "isActive", label: "Published", type: "checkbox" },
    ]} />
);

export const Memberships = () => (
  <ResourcePage title="Membership plans" itemName="plan" endpoint="memberships"
    columns={[{ label: "Order", key: "displayOrder" }, { label: "Name", key: "name" }, { label: "Months", key: "durationMonths" }, priceCol, activeCol]}
    fields={[
      { name: "name", label: "Name" }, { name: "durationMonths", label: "Duration (months)", type: "number", default: 1 },
      { name: "pricePaise", label: "Price in rupees (blank shows Contact for Pricing)", type: "rupees" },
      { name: "benefits", label: "Benefits (one per line)", type: "list" },
      { name: "displayOrder", label: "Display order", type: "number", default: 0 },
      { name: "isActive", label: "Published", type: "checkbox" },
    ]} />
);

export const Supplements = () => (
  <ResourcePage title="Supplements" itemName="product" endpoint="supplements"
    columns={[{ label: "Product", key: "productName" }, { label: "Brand", key: "brand" }, { label: "Size", key: "size" }, priceCol, { label: "Stock", key: "stockStatus" }, activeCol]}
    fields={[
      { name: "productName", label: "Product name" }, { name: "brand", label: "Brand" }, { name: "size", label: "Size" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "pricePaise", label: "Price in rupees (leave blank if unknown)", type: "rupees" },
      { name: "stockStatus", label: "Stock status", type: "select", default: "ON_REQUEST", options: [["IN_STOCK", "In stock"], ["OUT_OF_STOCK", "Out of stock"], ["ON_REQUEST", "On request"]] },
      { name: "imageUrl", label: "Photo of the actual product", help: imageHelp },
      { name: "isActive", label: "Published", type: "checkbox" },
    ]} />
);

export const Timings = () => (
  <ResourcePage title="Gym timings" itemName="session" endpoint="timings" canDelete
    columns={[
      { label: "Day", render: (i) => DAY_NAMES[i.dayOfWeek] },
      { label: "From", render: (i) => formatTime(i.startTime) }, { label: "To", render: (i) => formatTime(i.endTime) },
      { label: "Session", render: (i) => (i.sessionType === "LADIES_ONLY" ? "Ladies-only" : "Unisex") }, activeCol,
    ]}
    fields={[
      { name: "dayOfWeek", label: "Day", type: "select-number", default: 0, options: DAY_NAMES.map((d, i) => [i, d]) },
      { name: "startTime", label: "Start time", type: "time", default: "06:00" },
      { name: "endTime", label: "End time", type: "time", default: "12:00" },
      { name: "sessionType", label: "Session type", type: "select", options: [["UNISEX", "Unisex"], ["LADIES_ONLY", "Ladies-only"]] },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]} />
);

const uploadHelp = "Choose a file to upload, or paste a /images/... path or https:// link. Only approved photos and videos.";
const inHours = (h) => () => { const d = new Date(Date.now() + h * 3600 * 1000); d.setSeconds(0, 0); return d.toISOString(); };

export const Testimonials = () => (
  <ResourcePage title="Customer reviews" itemName="review" endpoint="testimonials" canDelete reorderable
    columns={[{ label: "Order", key: "displayOrder" }, { label: "Name", key: "displayName" },
      { label: "Rating", render: (i) => (i.rating ? `${i.rating}/5` : "None") }, { label: "Review", render: (i) => (i.quote.length > 60 ? `${i.quote.slice(0, 60)}...` : i.quote) }, activeCol]}
    fields={[
      { name: "displayName", label: "Name shown on the site", help: "A first name or display name is fine." },
      { name: "quote", label: "Review (the customer's own words)", type: "textarea", help: "Only genuine reviews the customer has agreed to publish." },
      { name: "rating", label: "Star rating, 1 to 5 (blank for none)", type: "number", nullable: true },
      { name: "photoUrl", label: "Customer photo (only with their permission)", type: "upload", accept: "image", help: uploadHelp },
      { name: "displayOrder", label: "Display order", type: "number", default: 0 },
      { name: "isActive", label: "Published", type: "checkbox", default: false },
    ]}
    renderPreview={(v) => (
      <figure className="rev-card" style={{ margin: 0, maxWidth: 420 }}>
        {v.rating ? <Stars rating={v.rating} /> : null}
        <blockquote>{v.quote}</blockquote>
        <figcaption className="rev-who"><span className="rev-avatar" aria-hidden="true">{(v.displayName || "?")[0].toUpperCase()}</span><span className="rev-name">{v.displayName}</span></figcaption>
      </figure>
    )} />
);

export const Gallery = () => (
  <ResourcePage title="Equipment gallery" itemName="item" endpoint="gallery" canDelete reorderable
    columns={[{ label: "Order", key: "displayOrder" }, { label: "Type", render: (i) => (i.mediaType === "VIDEO" ? "Video" : "Photo") },
      { label: "Caption", key: "caption" }, { label: "File", render: (i) => i.url.split("/").pop() }, activeCol]}
    fields={[
      { name: "url", label: "Photo or video", type: "upload", mediaTypeField: "mediaType", help: uploadHelp },
      { name: "mediaType", label: "Type", type: "select", default: "IMAGE", options: [["IMAGE", "Photo"], ["VIDEO", "Video"]] },
      { name: "posterUrl", label: "Video cover image (optional)", type: "upload", accept: "image", help: "Shown before a video is played." },
      { name: "caption", label: "Caption (optional)" },
      { name: "displayOrder", label: "Display order", type: "number", default: 0 },
      { name: "isActive", label: "Published", type: "checkbox" },
    ]} />
);

export const Promotions = () => (
  <ResourcePage title="Offers and announcements" itemName="promotion" endpoint="promotions" canDelete
    columns={[{ label: "Title", key: "title" }, { label: "Format", key: "format" }, { label: "Starts", render: (i) => new Date(i.startsAt).toLocaleString("en-IN") },
      { label: "Ends", render: (i) => new Date(i.endsAt).toLocaleString("en-IN") }, { label: "Priority", key: "priority" },
      { label: "Status", render: (i) => (i.isActive ? "On" : "Off (draft)") }]}
    fields={[
      { name: "title", label: "Offer title" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "terms", label: "Terms and conditions", type: "textarea" },
      { name: "imageUrl", label: "Banner image", type: "upload", accept: "image", help: uploadHelp },
      { name: "theme", label: "Festival theme", type: "select", default: "DEFAULT", options: [["DEFAULT", "None"], ["DIWALI", "Diwali"], ["VALENTINES", "Valentine's Day"], ["NEW_YEAR", "New Year"], ["GANESH_CHATURTHI", "Ganesh Chaturthi"], ["ANNIVERSARY", "Gym anniversary"]], help: "Sets the default emojis. Type your own below to override." },
      { name: "emojis", label: "Emojis (optional)", help: "For example 🪔✨🪔" },
      { name: "ctaText", label: "Button text (optional)" },
      { name: "ctaUrl", label: "Button link", help: "/contact, https://..., or tel:+91... Defaults to /contact if there is button text." },
      { name: "format", label: "Display format", type: "select", default: "POPUP", options: [["POPUP", "Pop-up"], ["BANNER", "Top banner"], ["CARD", "Card on the homepage"]] },
      { name: "frequency", label: "How often a visitor sees it", type: "select", default: "ONCE_PER_DAY", options: [["EVERY_VISIT", "Every visit"], ["ONCE_PER_SESSION", "Once per browser session"], ["ONCE_PER_DAY", "Once a day"], ["ONCE_PER_WEEK", "Once a week"], ["ONCE", "Only once"]] },
      { name: "priority", label: "Priority (higher wins if two are active)", type: "number", default: 0 },
      { name: "startsAt", label: "Starts", type: "datetime", default: inHours(0) },
      { name: "endsAt", label: "Ends", type: "datetime", default: inHours(24 * 14) },
      { name: "isActive", label: "Switched on (published within the dates above)", type: "checkbox", default: false },
    ]}
    renderPreview={(v) => <PromoAnnouncement promo={{ ...v, id: 0 }} preview onClose={() => {}} />} />
);
