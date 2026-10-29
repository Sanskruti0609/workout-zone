import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;

  async function submit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      await login(form.get("email"), form.get("password"));
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  }

  const input = "w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2";
  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="mb-6 text-2xl font-extrabold">Admin login</h1>
      <form onSubmit={submit} className="grid gap-4">
        <div><label htmlFor="email" className="mb-1 block text-sm">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" className={input} /></div>
        <div><label htmlFor="password" className="mb-1 block text-sm">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className={input} /></div>
        <button disabled={busy} className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-black disabled:opacity-60">
          {busy ? "Logging in..." : "Log in"}
        </button>
        {error && <p className="text-red-400" role="alert">{error}</p>}
      </form>
    </div>
  );
}
