export default function Section({ id, eyebrow, title, intro, children, className = "", alt = false, center = false }) {
  return (
    <section id={id} className={`sect ${alt ? "sect-alt" : ""} ${className}`}>
      <div className="container">
        {(eyebrow || title) && (
          <div className={`sect-head ${center ? "center" : ""}`}>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <h2>{title}</h2>}
            {intro && <p>{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
