import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import JobListings from "./pages/job_listing/JobListings";
import Contact from "./pages/contact/Contact";
import CompanyShowcase from "./pages/company_gallery/CompanyShowcase";
import Login from "./pages/login";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/jobs" element={<JobListings/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/companies" element={<PrivateRoute><CompanyShowcase/></PrivateRoute>} />
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}