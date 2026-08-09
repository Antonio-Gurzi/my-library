import axios from "axios";
// url base quando chiamo axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});
// il request interceptor intercetta la richiesta prima che arrivi al server, per allegare automaticamente il token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
