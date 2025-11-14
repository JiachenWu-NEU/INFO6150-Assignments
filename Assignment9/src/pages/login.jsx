import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPw] = useState("");
  const [err,setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e)=>{
    e.preventDefault();
    try{
      const { data } = await api.post("/auth/login",{ email, password });
      login(data.token);
      nav("/companies");
    }catch(e){
      setErr(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{padding:16,maxWidth:420}}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",width:"100%",margin:"8px 0"}}/>
      <input placeholder="Password" type="password" value={password} onChange={e=>setPw(e.target.value)} style={{display:"block",width:"100%",margin:"8px 0"}}/>
      {err && <div style={{color:"crimson"}}>{err}</div>}
      <button type="submit">Sign in</button>
    </form>
  );
}