<template>
  <div class="login-container">
    <Card>
      <form class="login-form" @submit.prevent="onSubmit">
        <h2 class="login-title">Bem-vindo de volta</h2>
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
          autocomplete="current-password"
        />
        <BaseButton type="submit" :loading="loading" color="primary">Entrar</BaseButton>
        <span v-if="error" class="error-text login-error">{{ error }}</span>
        <div class="register-link">
          <a href="/register">Não tem uma conta? Cadastre-se</a>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useLoadingStore } from '../../../stores/loading'
import BaseInput from '../../common/BaseInput.vue'
import BaseButton from '../../common/BaseButton.vue'
import Card from '../../common/Card.vue'

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
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: $gray-100;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
