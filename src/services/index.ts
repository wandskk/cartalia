import axios from "axios";

export const api = axios.create({
  baseURL: "https://cards-marketplace-api-2fjj.onrender.com",
  headers: { "Content-Type": "application/json" },
});
