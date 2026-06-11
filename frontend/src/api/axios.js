import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4500/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ping backend every 5 minutes to keep it awake
const keepAlive = () => {
  api.get("/").catch(() => {});
};
setInterval(keepAlive, 5 * 60 * 1000); // every 5 min
keepAlive(); // ping immediately on load
export default api;