import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #eee"}}>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/jobs">Job Listings</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/companies">Company Showcase</Link>
      <span style={{flex:1}}/>
      {!isAuthed
        ? <button onClick={()=>nav("/login")}>Login</button>
        : <button onClick={logout}>Logout</button>}
    </nav>
  );
}