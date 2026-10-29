import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-neutral-400" role="status">Checking your session...</p>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
