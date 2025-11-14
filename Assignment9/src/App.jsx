import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import JobListings from "./pages/job_listing/JobListings";
import Contact from "./pages/contact/Contact";
import CompanyShowcase from "./pages/company_gallery/CompanyShowcase";
import Login from "./pages/login";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { isAuthed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthed ? <Navigate to="/" replace /> : <Login />}
        />

        <Route element={<ProtectedLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="jobs" element={<JobListings />} />
          <Route path="contact" element={<Contact />} />
          <Route path="companies" element={<CompanyShowcase />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthed ? "/" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}