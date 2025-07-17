<template>
  <form @submit.prevent="onSubmit">
    <input v-model="name" type="text" placeholder="Nome" />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Senha" />
    <button type="submit">Registrar</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const auth = useAuthStore()

async function onSubmit() {
  await auth.register(name.value, email.value, password.value)
}
</script> 