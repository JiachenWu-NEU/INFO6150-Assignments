import axios from "axios";
import store from "../store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token || sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
