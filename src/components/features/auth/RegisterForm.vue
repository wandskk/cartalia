<template>
  <form @submit.prevent="onSubmit">
    <input v-model="name" type="text" placeholder="Nome" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />
    <button type="submit" :disabled="loading">Registrar</button>
    <span v-if="error" style="color: red">{{ error }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const auth = useAuthStore()

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Erro ao registrar'
  } finally {
    loading.value = false
  }
}
</script> 