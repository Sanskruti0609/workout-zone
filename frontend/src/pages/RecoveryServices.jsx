import ServicePage from "../components/common/ServicePage.jsx";
export default function RecoveryServices() {
  return (
    <ServicePage
      title="Steam and Massage"
      slugs={["steam", "massage"]}
      enquiryType="STEAM_MASSAGE"
      imageLabel="Photo of the steam and massage facilities"
      note="Enquire to check availability. Online booking is not available."
    />
  );
}
