import { api } from "..";

export const AuthServices = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/register", { name, email, password });
    return response.data;
  },
};
