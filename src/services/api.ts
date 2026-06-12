import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Axios instance riêng cho upload file — timeout dài hơn (60s)
export const uploadApi = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

// Helper gắn interceptor cho cả 2 instances
const attachInterceptors = (instance: typeof api) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
      }
      return Promise.reject(error);
    },
  );
};

attachInterceptors(api);
attachInterceptors(uploadApi);
