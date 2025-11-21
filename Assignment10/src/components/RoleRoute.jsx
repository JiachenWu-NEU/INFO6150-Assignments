import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleRoute({ allow = [] }) {
  const token = useSelector(s => s.auth.token);
  const userType = useSelector(s => s.auth.userType);
  if (!token) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(userType)) {

    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}