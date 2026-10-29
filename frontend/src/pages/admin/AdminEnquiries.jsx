import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api.js";

const STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export default function AdminEnquiries() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const q = new URLSearchParams({ page, pageSize: 20, ...(status && { status }) });
    api(`/api/admin/enquiries?${q}`).then(setResult).catch((e) => setError(e.message));
  }, [page, status]);
  useEffect(load, [load]);

  async function change(id, newStatus) {
    setError("");
    try { await api(`/api/admin/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) }); load(); }
    catch (e) { setError(e.message); }
  }

  const pages = result ? Math.max(1, Math.ceil(result.meta.total / result.meta.pageSize)) : 1;
  return (
    <div>
      <h1 className="mb-4 text-2xl font-extrabold">Enquiries</h1>
      <label className="mb-4 block text-sm">Show{" "}
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1">
          <option value="">All</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      {error && <p className="mb-4 text-red-400" role="alert">{error}</p>}
      {!result ? <p className="text-neutral-400" role="status">Loading...</p> : result.data.length === 0 ? <p className="text-neutral-400">No enquiries found.</p> : (
        <div className="grid gap-3">
          {result.data.map((e) => (
            <article key={e.id} className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{e.fullName} <span className="text-sm font-normal text-orange-500">{e.enquiryType}</span></p>
                  <p className="text-sm"><a className="text-orange-500" href={`tel:${e.phone.replace(/[^+\d]/g, "")}`}>{e.phone}</a>{e.email && ` · ${e.email}`}</p>
                  <p className="text-xs text-neutral-500">{new Date(e.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <select aria-label={`Status for enquiry ${e.id}`} value={e.status} onChange={(ev) => change(e.id, ev.target.value)}
                  className="rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {e.preferredVisitTime && <p className="mt-2 text-sm text-neutral-400">Preferred time: {e.preferredVisitTime}</p>}
              {e.message && <p className="mt-2 whitespace-pre-wrap text-neutral-300">{e.message}</p>}
            </article>
          ))}
        </div>
      )}
      <div className="mt-6 flex items-center gap-4 text-sm">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="disabled:opacity-40">Previous</button>
        <span>Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}
