import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, MenuItem } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [userType, setUserType] = useState("employee");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data?.token) throw new Error("no token");

      dispatch(setCredentials({ token: data.token, userType }));
      nav(userType === "admin" ? "/admin/employees" : "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Login failed");
    }
  };

  return (
    <Card sx={{ maxWidth: 420, m: 3 }}>
      <CardContent component="form" onSubmit={onSubmit}>
        <Typography variant="h6" gutterBottom>Login</Typography>

        <TextField
          select fullWidth margin="normal" label="Role (temp)"
          value={userType} onChange={e=>setUserType(e.target.value)}
        >
          <MenuItem value="employee">Employee</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <TextField fullWidth margin="normal" label="Email"
          value={email} onChange={e=>setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password"
          value={password} onChange={e=>setPw(e.target.value)} />

        {error && <Typography color="error" variant="body2">{error}</Typography>}

        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Sign in
        </Button>
      </CardContent>
    </Card>
  );
}