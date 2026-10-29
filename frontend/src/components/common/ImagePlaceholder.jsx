// Honest placeholder: never pretends to be a photo of the real gym.
export default function ImagePlaceholder({ label, className = "", style }) {
  return (
    <div role="img" aria-label={`Placeholder: ${label}`} className={`ph ${className}`} style={style}>
      <b>Placeholder</b>
      <span>{label}: approved photo needed</span>
    </div>
  );
}
