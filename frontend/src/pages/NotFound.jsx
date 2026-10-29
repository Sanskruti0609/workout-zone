import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="sect"><div className="container" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "clamp(40px,10vw,80px)" }}>Page not found</h1>
      <p className="muted" style={{ margin: "16px 0 28px" }}>That page doesn't exist. Head back to the home page.</p>
      <Link to="/" className="btn btn-primary">Back to home</Link>
    </div></section>
  );
}
