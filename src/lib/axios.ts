import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage for every request (client-side)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Optional: global 401 handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== 'undefined') {
      // Auto-logout on 401 if desired
      // localStorage.removeItem('accessToken');
      // window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;
