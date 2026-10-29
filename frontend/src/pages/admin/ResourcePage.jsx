import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api.js";
import RecordForm from "../../components/admin/RecordForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// Generic list + add/edit page for any admin CRUD resource.
export default function ResourcePage({ title, endpoint, fields, columns, canDelete = false, itemName, reorderable = false, renderPreview }) {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit
  const [preview, setPreview] = useState(null);

  const load = useCallback(() => {
    api(`/api/admin/${endpoint}`).then((r) => setItems(r.data)).catch((e) => setError(e.message));
  }, [endpoint]);
  useEffect(load, [load]);

  async function save(payload) {
    if (editing) await api(`/api/admin/${endpoint}/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    else await api(`/api/admin/${endpoint}`, { method: "POST", body: JSON.stringify(payload) });
    setEditing(undefined); load();
  }
  async function toggle(item) {
    setError("");
    try { await api(`/api/admin/${endpoint}/${item.id}`, { method: "PATCH", body: JSON.stringify({ isActive: !item.isActive }) }); load(); }
    catch (e) { setError(e.message); }
  }
  // Swap display order with the neighbour above or below. Orders are renumbered so ties can never block a move.
  async function move(index, dir) {
    const other = index + dir;
    if (other < 0 || other >= items.length) return;
    setError("");
    const reordered = [...items];
    [reordered[index], reordered[other]] = [reordered[other], reordered[index]];
    try {
      await Promise.all(reordered.map((it, i) => it.displayOrder === i + 1 ? null
        : api(`/api/admin/${endpoint}/${it.id}`, { method: "PATCH", body: JSON.stringify({ displayOrder: i + 1 }) })));
      load();
    } catch (e) { setError(e.message); load(); }
  }
  async function remove(item) {
    if (!window.confirm("Delete this record permanently?")) return;
    setError("");
    try { await api(`/api/admin/${endpoint}/${item.id}`, { method: "DELETE" }); load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {editing === undefined && (
          <button onClick={() => setEditing(null)} className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black">Add {itemName}</button>
        )}
      </div>
      {error && <p className="mb-4 text-red-400" role="alert">{error}</p>}
      {editing !== undefined && (
        <div className="mb-8 max-w-2xl">
          <RecordForm key={editing?.id ?? "new"} fields={fields} item={editing} onSubmit={save} onCancel={() => setEditing(undefined)} onPreview={renderPreview ? setPreview : undefined} />
        </div>
      )}
      {preview && renderPreview && (
        <div className="mb-8 max-w-2xl rounded-xl border border-neutral-700 p-4">
          <div className="mb-3 flex items-center justify-between"><p className="text-sm text-neutral-400">Preview. This is not published until you save and switch it on.</p>
            <button type="button" className="text-sm text-neutral-300" onClick={() => setPreview(null)}>Close preview</button></div>
          {renderPreview(preview)}
        </div>
      )}
      {!items ? <p className="text-neutral-400" role="status">Loading...</p> : items.length === 0 ? <p className="text-neutral-400">Nothing here yet.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-400"><tr>
              {columns.map((c) => <th key={c.label} className="py-2 pr-4">{c.label}</th>)}<th className="py-2">Actions</th>
            </tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={`border-t border-neutral-800 ${item.isActive === false ? "opacity-50" : ""}`}>
                  {columns.map((c) => <td key={c.label} className="py-2 pr-4">{c.render ? c.render(item) : String(item[c.key] ?? "")}</td>)}
                  <td className="space-x-3 py-2">
                    <button className="text-orange-500" onClick={() => setEditing(item)}>Edit</button>
                    {reorderable && (<>
                      <button className="text-neutral-300 disabled:opacity-30" disabled={index === 0} aria-label={`Move ${itemName} up`} onClick={() => move(index, -1)}>Up</button>
                      <button className="text-neutral-300 disabled:opacity-30" disabled={index === items.length - 1} aria-label={`Move ${itemName} down`} onClick={() => move(index, 1)}>Down</button>
                    </>)}
                    {"isActive" in item && <button className="text-neutral-300" onClick={() => toggle(item)}>{item.isActive ? "Deactivate" : "Activate"}</button>}
                    {canDelete && user.role === "ADMIN" && <button className="text-red-400" onClick={() => remove(item)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
