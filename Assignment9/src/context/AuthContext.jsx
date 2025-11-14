import { createContext, useContext, useState } from "react";
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const isAuthed = !!token;

  const login = (t) => { setToken(t); sessionStorage.setItem("token", t); };
  const logout = () => { setToken(null); sessionStorage.removeItem("token"); };

  return (
    <AuthCtx.Provider value={{ token, isAuthed, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}