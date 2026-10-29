import Hero from "../components/home/Hero.jsx";
import PromoHost from "../components/promo/PromoHost.jsx";
import ServicesSection from "../components/home/ServicesSection.jsx";
import HyroxSection from "../components/home/HyroxSection.jsx";
import GallerySection from "../components/home/GallerySection.jsx";
import ReviewsSection from "../components/home/ReviewsSection.jsx";
import TimingsSection from "../components/home/TimingsSection.jsx";
import ContactSection from "../components/home/ContactSection.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <PromoHost />
      <ServicesSection />
      <HyroxSection />
      <GallerySection />
      <ReviewsSection />
      <TimingsSection />
      <ContactSection />
    </>
  );
}
