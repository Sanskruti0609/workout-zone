import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const LINKS = [
  ["/admin", "Dashboard"], ["/admin/enquiries", "Enquiries"], ["/admin/business", "Business info"],
  ["/admin/trainers", "Trainers"], ["/admin/timings", "Timings"], ["/admin/memberships", "Memberships"],
  ["/admin/services", "Services"], ["/admin/supplements", "Supplements"],
  ["/admin/promotions", "Offers"], ["/admin/gallery", "Gallery"], ["/admin/testimonials", "Reviews"],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) => `block rounded px-3 py-2 ${isActive ? "bg-orange-500 text-black" : "hover:bg-neutral-800"}`;
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-neutral-800 bg-neutral-900 p-4 md:w-60 md:border-b-0 md:border-r">
        <p className="mb-1 font-extrabold">WORKOUT <span className="text-orange-500">ZONE</span> Admin</p>
        <p className="mb-4 text-xs text-neutral-400">{user.name} ({user.role})</p>
        <nav className="grid gap-1 text-sm" aria-label="Admin">
          {LINKS.map(([to, label]) => <NavLink key={to} to={to} end={to === "/admin"} className={cls}>{label}</NavLink>)}
        </nav>
        <button className="mt-4 text-sm text-neutral-400 hover:text-white"
          onClick={async () => { await logout(); navigate("/admin/login"); }}>Log out</button>
      </aside>
      <main className="flex-1 p-6"><Outlet /></main>
    </div>
  );
}
