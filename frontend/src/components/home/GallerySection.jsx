import { useFetch } from "../../hooks/useFetch.js";
import GalleryGrid from "../gallery/GalleryGrid.jsx";
import ImagePlaceholder from "../common/ImagePlaceholder.jsx";
import Reveal from "../common/Reveal.jsx";
import Section from "../common/Section.jsx";
import { Loading, ErrorMessage } from "../common/Status.jsx";

export default function GallerySection() {
  const { data, loading, error } = useFetch("/api/gallery");
  return (
    <Section id="gallery" alt eyebrow="The gym" title="Our equipment." intro="Photos and videos of the equipment on the gym floor.">
      {loading ? <Loading /> : error ? <ErrorMessage message={error} /> : data.length === 0 ? (
        <div className="gal-grid">
          {[0, 1, 2].map((n) => <ImagePlaceholder key={n} label="Gym equipment photo" style={{ aspectRatio: "4 / 3" }} />)}
        </div>
      ) : <Reveal><GalleryGrid items={data} /></Reveal>}
    </Section>
  );
}
