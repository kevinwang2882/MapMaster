import axios from 'axios';

const LOCALSTORAGE_KEY = import.meta.env.VITE_LOCAL_STORAGE_KEY;
const API_URL = import.meta.env.VITE_DATABASE_URL;

const api = axios.create({
  baseURL: API_URL,
});
//When making a request to the API, the api instance 
//adds an Authorization header to the request with a JWT token retrieved from the localStorage.
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
//The API server uses this token to authenticate the user. If the token is valid,
// the server processes the request. Otherwise, it returns an authentication error.
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
