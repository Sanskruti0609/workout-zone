import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import RecordForm from "../../components/admin/RecordForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const fields = [
  { name: "name", label: "Business name" }, { name: "marathiName", label: "Marathi name" },
  { name: "address", label: "Address", type: "textarea" }, { name: "phone", label: "Phone" },
  { name: "googleRating", label: "Google rating (0 to 5)", type: "number", nullable: true },
  { name: "reviewCount", label: "Number of Google reviews", type: "number", nullable: true },
  { name: "mapUrl", label: "Google Maps link", help: "Optional https:// link. If empty, a directions link is built from the address." },
  { name: "openingInfo", label: "Opening information" },
];

export default function AdminBusiness() {
  const { user } = useAuth();
  const [item, setItem] = useState(undefined);
  const [saved, setSaved] = useState(false);
  useEffect(() => { api("/api/admin/business").then((r) => setItem(r.data)); }, []);

  if (item === undefined) return <p className="text-neutral-400" role="status">Loading...</p>;
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-extrabold">Business information</h1>
      {user.role !== "ADMIN" && <p className="mb-4 text-neutral-400">Only administrators can change this.</p>}
      <RecordForm fields={fields} item={item} submitLabel="Save changes"
        onSubmit={async (payload) => {
          const r = await api("/api/admin/business", { method: "PUT", body: JSON.stringify(payload) });
          setItem(r.data); setSaved(true);
        }} />
      {saved && <p className="mt-3 text-green-400" role="status">Saved.</p>}
    </div>
  );
}
