import ServicePage from "../components/common/ServicePage.jsx";
export default function Facilities() {
  return (
    <ServicePage
      title="Facilities"
      slugs={["gym-strength-training", "equipment-cleanliness", "ladies-only-sessions"]}
      enquiryType="GENERAL"
      imageLabel="Photo of the renovated gym interior and equipment"
    />
  );
}
