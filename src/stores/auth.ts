import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthServices } from "../services/modules/auth";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("tokenCartalia"));
  const isAuthenticated = computed(() => !!token.value && !!user.value);


  const storedUser = localStorage.getItem("userCartalia");
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (error) {
      console.error('Erro ao parsear dados do usuário do localStorage:', error);
      localStorage.removeItem("userCartalia");
      user.value = null;
    }
  }

  function setUser(data: User, authToken: string) {
    user.value = data;
    token.value = authToken;
    localStorage.setItem("tokenCartalia", authToken);
    localStorage.setItem("userCartalia", JSON.stringify(data));
  }

  function logout() {
    user.value = null;
    token.value = null;
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
    if (!token.value) {
      throw new Error('No token available');
    }
    
    try {
      const userData = await AuthServices.getUserProfile();
      setUser(userData, token.value);
      return userData;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  }

  return { user, token, isAuthenticated, setUser, login, register, logout, fetchUserProfile };
});
