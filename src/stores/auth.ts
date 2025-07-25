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
  const token = ref<string | null>(localStorage.getItem("tokenCartalia"));
  const isAuthenticated = ref<boolean>(!!token.value);

  const storedUser = localStorage.getItem("userCartalia");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  function setUser(data: User, authToken: string) {
    user.value = data;
    token.value = authToken;
    isAuthenticated.value = true;
    localStorage.setItem("tokenCartalia", authToken);
    localStorage.setItem("userCartalia", JSON.stringify(data));
  }

  function logout() {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("tokenCartalia");
    localStorage.removeItem("userCartalia");
  }

  async function login(email: string, password: string) {
    const data = await AuthServices.login(email, password);
    setUser(data.user, data.token);
  }

  async function register(name: string, email: string, password: string) {
    await AuthServices.register(name, email, password);
    await login(email, password);
  }

  async function fetchUserProfile() {
    if (!token.value) return;
    
    try {
      const userData = await AuthServices.getUserProfile();
      setUser(userData, token.value);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  }

  return { user, token, isAuthenticated, login, register, logout, fetchUserProfile };
});
