<template>
  <div class="register-container">
    <form class="register-form" @submit.prevent="onSubmit">
      <h2 class="register-title">Criar conta</h2>
      <div class="form-group">
        <label for="name">Nome</label>
        <input id="name" v-model="name" type="text" placeholder="Digite seu nome" class="input" />
      </div>
      <div class="form-group">
        <label for="email">E-mail</label>
        <input id="email" v-model="email" type="email" placeholder="Digite seu e-mail" class="input" />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input id="password" v-model="password" type="password" placeholder="Digite sua senha" class="input" />
      </div>
      <button type="submit" :disabled="loading" class="register-btn">Cadastrar</button>
      <span v-if="error" class="error-text register-error">{{ error }}</span>
      <div class="login-link">
        <a href="/login">Já tem uma conta? Entrar</a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useLoadingStore } from '../../../stores/loading'

const name = ref('')
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
    await auth.register(name.value, email.value, password.value)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Erro ao registrar'
  } finally {
    loading.value = false
    globalLoading.stopLoading()
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.register-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}
.register-form {
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
.register-title {
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
.register-btn {
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
.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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