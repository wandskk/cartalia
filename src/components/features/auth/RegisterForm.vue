<template>
  <div class="register-container">
    <Card>
      <form class="register-form" @submit.prevent="onSubmit">
        <h2 class="register-title">Criar conta</h2>
        <BaseInput
          id="name"
          v-model="name"
          label="Nome"
          placeholder="Digite seu nome"
          type="text"
          autocomplete="name"
        />
        <BaseInput
          id="email"
          v-model="email"
          label="E-mail"
          placeholder="Digite seu e-mail"
          type="email"
          autocomplete="email"
        />
        <BaseInput
          id="password"
          v-model="password"
          label="Senha"
          placeholder="Digite sua senha"
          type="password"
          autocomplete="new-password"
        />
        <BaseButton type="submit" :loading="loading" color="primary"
          >Cadastrar</BaseButton
        >
        <span v-if="error" class="error-text register-error">{{ error }}</span>
        <div class="login-link">
          <a href="/login">Já tem uma conta? Entrar</a>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth";
import { useLoadingStore } from "../../../stores/loading";
import BaseInput from "../../common/BaseInput.vue";
import BaseButton from "../../common/BaseButton.vue";
import Card from "../../common/Card.vue";

const name = ref("");
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
    await auth.register(name.value, email.value, password.value);
  } catch (e: any) {
    error.value = e?.response?.data?.message || "Erro ao registrar";
  } finally {
    loading.value = false;
    globalLoading.stopLoading();
  }
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.register-container {
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  margin-top: 0;
}
.register-title {
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  color: $gray-900;
}
.register-error {
  text-align: center;
  font-size: 1rem;
  margin-top: -0.5rem;
}
.login-link {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.98rem;
}
.login-link a {
  color: $gray-500;
  text-decoration: underline;
  transition: color 0.2s;
}
.login-link a:hover {
  color: $primary;
}
@media (max-width: 480px) {
  .register-form {
    min-width: 0;
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
