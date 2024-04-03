import axios from 'axios';

const LOCALSTORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;
const API_URL = import.meta.env.VITE_DATABASE_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(LOCALSTORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle global errors here
    console.error('Global error:', error);
    return Promise.reject(error);
  }
);

export default api;
