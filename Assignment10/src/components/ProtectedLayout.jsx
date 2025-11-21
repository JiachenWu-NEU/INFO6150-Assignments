import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavBar from "./NavBar";

export default function ProtectedLayout() {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}