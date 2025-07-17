<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />
    <button type="submit" :disabled="loading">Entrar</button>
    <span v-if="error" style="color: red">{{ error }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useLoadingStore } from "../../../stores/loading";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const auth = useAuthStore();
const globalLoading = useLoadingStore();

async function onSubmit() {
  error.value = "";
  loading.value = true;
  globalLoading.startLoading();
  try {
    await auth.login(email.value, password.value);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Erro ao fazer login";
  } finally {
    loading.value = false;
    globalLoading.stopLoading();
  }
}
</script>
