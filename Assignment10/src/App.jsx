import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedLayout from "./components/ProtectedLayout";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import JobListings from "./pages/job_listing/JobListings";
import Contact from "./pages/contact/Contact";
import CompanyShowcase from "./pages/company_gallery/CompanyShowcase";

import AdminEmployees from "./pages/admin/AdminEmployees";
import AddJob from "./pages/admin/AddJob";
import Login from "./pages/login";

export default function App() {
  const token = useSelector(s => s.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />

        <Route element={<ProtectedLayout />}>
          <Route element={<RoleRoute allow={["employee"]} />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="jobs" element={<JobListings />} />
            <Route path="contact" element={<Contact />} />
            <Route path="companies" element={<CompanyShowcase />} />
          </Route>

          <Route element={<RoleRoute allow={["admin"]} />}>
            <Route path="admin/employees" element={<AdminEmployees />} />
            <Route path="add-job" element={<AddJob />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}