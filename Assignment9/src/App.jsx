import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import JobListings from "./pages/JobListings";
import Contact from "./pages/Contact";
import CompanyShowcase from "./pages/CompanyShowcase";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/jobs" element={<JobListings/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/companies" element={
          <PrivateRoute><CompanyShowcase/></PrivateRoute>
        }/>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
}