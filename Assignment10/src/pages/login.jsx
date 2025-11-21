import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token);
      nav("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Card sx={{ maxWidth: 420, m: 3 }}>
      <CardContent component="form" onSubmit={onSubmit}>
        <Typography variant="h6" gutterBottom>Login</Typography>
        <TextField fullWidth margin="normal" label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e=>setPw(e.target.value)} />
        {error && <Typography color="error" variant="body2">{error}</Typography>}
        <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>Sign in</Button>
      </CardContent>
    </Card>
  );
}