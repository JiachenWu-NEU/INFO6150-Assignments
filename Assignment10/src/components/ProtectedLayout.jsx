import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";

export default function ProtectedLayout() {
  const token = useSelector(s => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (<><NavBar /><Outlet /></>);
}