import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 15000,
});

/* ─── Attach JWT token to every request ─── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ─── Handle 401 globally → auto-logout ─── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → clear session and redirect to login
      const isAuthRoute = error.config?.url?.includes('/auth/');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/* ─── Helper: build image URL from filename ─── */
const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:4000';
export const getImageUrl = (filename) =>
  filename ? `${BASE_URL}/uploads/${filename}` : null;

