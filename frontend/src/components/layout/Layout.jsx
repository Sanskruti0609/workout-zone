import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch.js";
import { telHref } from "../../utils/format.js";
import Icon from "../common/Icon.jsx";

const NAV = [
  { to: "/#services", label: "Services" },
  { to: "/#hyrox", label: "HYROX" },
  { to: "/#gallery", label: "Gallery" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#timings", label: "Timings" },
  { to: "/trainers", label: "Trainers", page: true },
  { to: "/memberships", label: "Memberships", page: true },
  { to: "/#contact", label: "Contact" },
];
const FOOTER_EXTRA = [
  { to: "/yoga", label: "Yoga" },
  { to: "/facilities", label: "Facilities" },
  { to: "/recovery", label: "Steam & massage" },
  { to: "/supplements", label: "Supplements" },
];
const INSTAGRAM_HANDLE = "workoutzone_parel";

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  // `key` changes on every navigation, so clicking Enquire again still scrolls to the form
  // even when the address already ends in #contact.
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const progress = useRef(null);
  const { pathname } = useLocation();
  const { data: business } = useFetch("/api/business");
  const isHome = pathname === "/";
  // On the homepage, while the hero is on screen, the header shows only the Enquire button.
  // Once the visitor scrolls past the hero, the full navigation returns.
  const heroView = isHome && !pastHero;

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 40);
      setPastHero(window.scrollY > window.innerHeight * 0.65);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : "0%";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const item = (n, extra = {}) => n.page
    ? <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? "active" : "")} {...extra}>{n.label}</NavLink>
    : <Link key={n.to} to={n.to} {...extra}>{n.label}</Link>;

  const menuOpen = open && !heroView;

  return (
    <>
      <ScrollManager />
      <div ref={progress} className="progress-fill" aria-hidden="true" />
      <header className={heroView ? "hero-view" : solid || open ? "solid" : ""} id="siteHeader">
        <div className="container nav-wrap">
          {!heroView && (
            <Link to="/" className="brand" aria-label="Workout Zone home">
              <span className="logo-wrap"><img src="/workout_zone_logo.png" alt="" /></span>
              <span className="brand-text">WORKOUT ZONE<span>Parel, Mumbai</span></span>
            </Link>
          )}
          {!heroView && <nav className="nav-links" aria-label="Main">{NAV.map((n) => item(n))}</nav>}
          <div className="nav-right">
            <Link to="/#contact" className="btn btn-primary nav-cta">Enquire</Link>
            {!heroView && (
              <button type="button" className={`burger ${open ? "open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobileMenu" onClick={() => setOpen(!open)}>
                <span className="lines"><span /><span /><span /></span>
              </button>
            )}
          </div>
        </div>
      </header>

      {!heroView && (
        <nav id="mobileMenu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-label="Mobile" aria-hidden={!menuOpen} inert={!menuOpen ? "" : undefined}>
          {NAV.map((n) => item(n, { onClick: () => setOpen(false) }))}
          <Link to="/contact" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>Contact the gym</Link>
          {business && <div className="mobile-menu-foot">{business.address}</div>}
        </nav>
      )}

      <main id="main" className={isHome ? "" : "page"}><Outlet /></main>

      <footer id="footer">
        <div className="container">
          <div className="foot-top">
            <div>
              <div className="foot-brand">
                <span className="logo-wrap"><img src="/workout_zone_logo.png" alt="" /></span>
                <div className="foot-brand-text">WORKOUT ZONE<span>Parel, Mumbai</span></div>
              </div>
              {business && (
                <p className="foot-contact">
                  {business.address}<br />
                  <a href={telHref(business.phone)}>{business.phone}</a>
                </p>
              )}
            </div>
            <nav className="foot-links" aria-label="Footer">
              {NAV.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
              {FOOTER_EXTRA.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
            </nav>
            <div className="foot-social">
              <a href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`} className="t-social" aria-label="Workout Zone on Instagram" target="_blank" rel="noopener noreferrer">
                <Icon name="instagram" strokeWidth={1.6} />
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <div>© {new Date().getFullYear()} <strong>Workout Zone</strong>, Parel, Mumbai. All rights reserved.</div>
            <div>Strength, Yoga, Zumba and HYROX under one roof.</div>
          </div>
        </div>
      </footer>

      {!heroView && (
        <div className="mobile-cta">
          {business ? <a href={telHref(business.phone)} className="wa"><Icon name="phone" />Call</a> : <span />}
          <Link to="/#contact" className="join">Enquire</Link>
        </div>
      )}
    </>
  );
}