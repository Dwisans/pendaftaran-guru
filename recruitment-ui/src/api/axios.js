import axios from "axios";

const api = axios.create({
    // Cukup ganti di satu tempat ini saja jika ingin ganti IP/Localhost
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor: Otomatis mengirimkan Token di setiap request jika user sudah login
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
