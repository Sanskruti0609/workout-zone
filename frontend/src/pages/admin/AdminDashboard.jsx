import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [newCount, setNewCount] = useState(null);
  useEffect(() => {
    api("/api/admin/enquiries?status=NEW&pageSize=1").then((r) => setNewCount(r.meta.total)).catch(() => setNewCount(null));
  }, []);
  return (
    <div>
      <h1 className="mb-2 text-2xl font-extrabold">Welcome, {user.name}</h1>
      <p className="mb-6 text-neutral-400">Use the menu to update what visitors see on the website.</p>
      <Link to="/admin/enquiries" className="inline-block rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-3xl font-extrabold text-orange-500">{newCount ?? "-"}</p>
        <p className="text-neutral-300">new enquiries</p>
      </Link>
    </div>
  );
}
