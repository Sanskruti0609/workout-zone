const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
export const API_BASE = BASE;

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Required by the backend for state-changing admin requests (CSRF defence).
      "X-Requested-With": "WorkoutZoneAdmin",
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status, data.fields);
  return data;
}

// Uploads a photo or video chosen in the admin dashboard. Returns { url, mediaType }.
export async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${BASE}/api/admin/uploads`, {
    method: "POST",
    credentials: "include",
    headers: { "X-Requested-With": "WorkoutZoneAdmin" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Upload failed (${res.status})`, res.status);
  return data.data;
}
