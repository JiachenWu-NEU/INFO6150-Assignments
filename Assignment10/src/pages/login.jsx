import { useState } from "react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data?.token) throw new Error("No token from server");
      if (!data?.role)  throw new Error("No role from server");

      dispatch(setCredentials({ token: data.token, userType: data.role }));

      if (data.role === "admin") {
        nav("/admin/employees", { replace: true });
      } else {
        nav("/", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Wrong email or password");
    }
  };

  return (
    <Card sx={{ maxWidth: 420, m: 3 }}>
      <CardContent component="form" onSubmit={onSubmit}>
        <Typography variant="h6" gutterBottom>Login</Typography>

        <TextField
          fullWidth margin="normal" label="Email"
          value={email} onChange={e=>setEmail(e.target.value)}
        />
        <TextField
          fullWidth margin="normal" label="Password" type="password"
          value={password} onChange={e=>setPw(e.target.value)}
        />

        {error && <Typography color="error" variant="body2">{error}</Typography>}

        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Sign in
        </Button>
      </CardContent>
    </Card>
  );
}