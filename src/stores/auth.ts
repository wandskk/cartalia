import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthServices } from "../services/modules/auth";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const isAuthenticated = ref<boolean>(!!token.value);

  function setUser(data: User, authToken: string) {
    user.value = data;
    token.value = authToken;
    isAuthenticated.value = true;
    localStorage.setItem("token", authToken);
  }

  function logout() {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
  }

  async function login(email: string, password: string) {
    const data = await AuthServices.login(email, password);
    setUser(data.user, data.token);
  }

  async function register(name: string, email: string, password: string) {
    const data = await AuthServices.register(name, email, password);
    setUser({ id: data.userId, name, email }, "");
  }

  return { user, token, isAuthenticated, login, register, logout };
});
