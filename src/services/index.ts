import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

export const api = axios.create({
  baseURL: "https://cards-marketplace-api-2fjj.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenCartalia');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error, 'API Interceptor');
    return Promise.reject(error);
  }
);
