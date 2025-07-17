<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="onSubmit">
      <h2 class="login-title">Bem-vindo de volta</h2>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" v-model="email" type="email" placeholder="Digite seu e-mail" class="input" />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" v-model="password" type="password" placeholder="Digite sua senha" class="input" />
      </div>
      <button type="submit" :disabled="loading" class="login-btn">Entrar</button>
      <span v-if="error" class="error-text login-error">{{ error }}</span>
      <div class="register-link">
        <a href="/register">Não tem uma conta? Cadastre-se</a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useLoadingStore } from '../../../stores/loading'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()
const globalLoading = useLoadingStore()

async function onSubmit() {
  error.value = ''
  loading.value = true
  globalLoading.startLoading()
  try {
    await auth.login(email.value, password.value)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Erro ao fazer login'
  } finally {
    loading.value = false
    globalLoading.stopLoading()
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.login-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}
.login-form {
  background: $white;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 12px;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 320px;
  max-width: 400px;
  width: 100%;
  margin-top: 0;
}
.login-title {
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  font-size: 2rem;
  text-align: center;
  color: $gray-900;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
label {
  font-size: 1rem;
  color: $gray-800;
  font-weight: 500;
}
.input {
  padding: 0.9rem 1rem;
  border: 1.5px solid $gray-300;
  border-radius: 10px;
  font-size: 1rem;
  background: $white;
  color: $gray-900;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: $primary;
}
.login-btn {
  width: 100%;
  padding: 0.9rem 0;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  background: $primary;
  color: $white;
  margin-top: 0.5rem;
  transition: background 0.2s;
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.login-error {
  text-align: center;
  font-size: 1rem;
  margin-top: -0.5rem;
}
.register-link {
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.98rem;
}
.register-link a {
  color: $gray-500;
  text-decoration: underline;
  transition: color 0.2s;
}
.register-link a:hover {
  color: $primary;
}
@media (max-width: 480px) {
  .login-form {
    min-width: 0;
    padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  }
}
</style>
