import { useRef, useState } from "react";
import { API_BASE, uploadFile } from "../../services/api.js";
import { mediaUrl } from "../../utils/format.js";

const input = "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white";

const pad = (n) => String(n).padStart(2, "0");
// ISO (UTC) <-> the browser's "YYYY-MM-DDTHH:mm" local format used by datetime-local inputs.
export const isoToLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const dflt = (f) => (typeof f.default === "function" ? f.default() : f.default);

export function toForm(fields, item) {
  const v = {};
  for (const f of fields) {
    const raw = item?.[f.name];
    if (f.type === "checkbox") v[f.name] = item ? !!raw : (dflt(f) ?? true);
    else if (f.type === "rupees") v[f.name] = raw == null ? "" : String(raw / 100);
    else if (f.type === "list") v[f.name] = (raw ?? []).join("\n");
    else if (f.type === "datetime") v[f.name] = item ? isoToLocal(raw) : (dflt(f) ?? "");
    else v[f.name] = raw ?? (dflt(f) ?? "");
  }
  return v;
}

export function toPayload(fields, v) {
  const out = {};
  for (const f of fields) {
    const raw = v[f.name];
    if (f.type === "checkbox") out[f.name] = !!raw;
    else if (f.type === "number" || f.type === "select-number") out[f.name] = raw === "" ? (f.nullable ? null : undefined) : Number(raw);
    else if (f.type === "rupees") out[f.name] = raw === "" ? null : Math.round(parseFloat(raw) * 100);
    else if (f.type === "list") out[f.name] = String(raw).split(/\n|,/).map((s) => s.trim()).filter(Boolean);
    else if (f.type === "datetime") out[f.name] = raw ? new Date(raw).toISOString() : undefined;
    else out[f.name] = raw;
  }
  return out;
}

function UploadField({ field, value, onChange, onMediaType }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr("");
    try {
      const r = await uploadFile(file);
      onChange(r.url);
      if (field.mediaTypeField) onMediaType(field.mediaTypeField, r.mediaType);
    } catch (ex) { setErr(ex.message); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  }
  const src = value ? mediaUrl(value, API_BASE) : "";
  const isVideo = /\.(mp4|webm)$/i.test(value || "");
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input ref={fileRef} type="file" accept={field.accept === "image" ? "image/jpeg,image/png,image/webp" : "image/jpeg,image/png,image/webp,video/mp4,video/webm"} onChange={pick} disabled={busy} aria-label={`${field.label}: choose a file to upload`} className="text-sm" />
        {busy && <span className="text-sm text-neutral-400" role="status">Uploading...</span>}
        {value && <button type="button" className="text-sm text-red-400" onClick={() => onChange("")}>Remove</button>}
      </div>
      <input id={`f-${field.name}`} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste a /images/... path or https:// link" className={`${input} mt-2`} />
      {src && (isVideo ? <video src={src} controls preload="metadata" className="mt-2 max-h-40 rounded" /> : <img src={src} alt="" className="mt-2 max-h-40 rounded" />)}
      {err && <p className="mt-1 text-sm text-red-400" role="alert">{err}</p>}
    </div>
  );
}

export default function RecordForm({ fields, item, onSubmit, onCancel, submitLabel = "Save", onPreview }) {
  const [values, setValues] = useState(() => toForm(fields, item));
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (name, val) => setValues((p) => ({ ...p, [name]: val }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(""); setFieldErrors({});
    try {
      await onSubmit(toPayload(fields, values));
    } catch (err) {
      setError(err.message); setFieldErrors(err.fields || {});
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      {fields.map((f) => {
        const id = `f-${f.name}`;
        const common = { id, value: values[f.name], onChange: (e) => set(f.name, e.target.value), className: input };
        return (
          <div key={f.name}>
            {f.type === "checkbox" ? (
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)} /> {f.label}
              </label>
            ) : (
              <>
                <label htmlFor={id} className="mb-1 block text-sm">{f.label}</label>
                {f.type === "upload" ? <UploadField field={f} value={values[f.name]} onChange={(val) => set(f.name, val)} onMediaType={set} />
                  : f.type === "textarea" || f.type === "list" ? <textarea rows={f.type === "list" ? 4 : 3} {...common} />
                  : f.type === "select" || f.type === "select-number" ? (
                    <select {...common}>{f.options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}</select>
                  ) : <input type={f.type === "rupees" || f.type === "number" ? "number" : f.type === "time" ? "time" : f.type === "datetime" ? "datetime-local" : "text"}
                      step={f.type === "rupees" ? "0.01" : undefined} min={f.type === "rupees" || f.type === "number" ? 0 : undefined} {...common} />}
              </>
            )}
            {f.help && <p className="mt-1 text-xs text-neutral-500">{f.help}</p>}
            {fieldErrors[f.name] && <p className="mt-1 text-sm text-red-400" role="alert">{fieldErrors[f.name]}</p>}
          </div>
        );
      })}
      <div className="flex flex-wrap gap-3">
        <button disabled={busy} className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black disabled:opacity-60">{busy ? "Saving..." : submitLabel}</button>
        {onPreview && <button type="button" onClick={() => onPreview(toPayload(fields, values))} className="rounded-lg border border-orange-500 px-4 py-2 text-orange-500">Preview</button>}
        {onCancel && <button type="button" onClick={onCancel} className="rounded-lg border border-neutral-600 px-4 py-2">Cancel</button>}
      </div>
      {error && <p className="text-red-400" role="alert">{error}</p>}
    </form>
  );
}
