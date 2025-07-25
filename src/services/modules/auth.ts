import { api } from "..";
import type { User } from "../../types/auth";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/register", { name, email, password });
    return response.data;
  },
  getUserProfile: async (): Promise<User> => {
    const response = await api.get("/me");
    return response.data;
  },
};
