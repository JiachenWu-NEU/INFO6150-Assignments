import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function NavBar() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector(s => s.auth.userType);

  const onLogout = () => { dispatch(logout()); nav("/login", { replace:true }); };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        {userType === "employee" && (
          <>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/about">About</Button>
            <Button color="inherit" component={Link} to="/jobs">Job Listings</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
            <Button color="inherit" component={Link} to="/companies">Company Showcase</Button>
          </>
        )}

        {userType === "admin" && (
          <>
            <Button color="inherit" component={Link} to="/admin/employees">Employees</Button>
            <Button color="inherit" component={Link} to="/add-job">Add Job</Button>
          </>
        )}

        <Box sx={{ flex: 1 }} />
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}