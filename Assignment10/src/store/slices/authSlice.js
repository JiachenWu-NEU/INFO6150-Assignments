import { createSlice } from "@reduxjs/toolkit";

const initialToken = sessionStorage.getItem("token");
const initialType  = sessionStorage.getItem("userType"); // "admin" | "employee" | null

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken || null,
    userType: initialType || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, userType } = action.payload || {};
      state.token = token || null;
      state.userType = userType || null;

      if (token) sessionStorage.setItem("token", token); else sessionStorage.removeItem("token");
      if (userType) sessionStorage.setItem("userType", userType); else sessionStorage.removeItem("userType");
    },
    logout: (state) => {
      state.token = null;
      state.userType = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userType");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;