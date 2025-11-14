import { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const isAuthed = !!token;

  const login = (t) => { setToken(t); localStorage.setItem("token", t); };
  const logout = () => { setToken(null); localStorage.removeItem("token"); };

  useEffect(() => {}, []);

  return (
    <AuthCtx.Provider value={{ token, isAuthed, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}