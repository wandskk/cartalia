import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref<boolean>(!!token.value)

  function setUser(data: User, authToken: string) {
    user.value = data
    token.value = authToken
    isAuthenticated.value = true
    localStorage.setItem('token', authToken)
  }

  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  async function login(email: string, password: string) {
    const response = await fetch('https://cards-marketplace-api-2fjj.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Login failed')
    const data = await response.json()
    setUser(data.user, data.token)
  }

  async function register(name: string, email: string, password: string) {
    const response = await fetch('https://cards-marketplace-api-2fjj.onrender.com/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    if (!response.ok) throw new Error('Register failed')
    const data = await response.json()
    setUser({ id: data.userId, name, email }, '')
  }

  return { user, token, isAuthenticated, login, register, logout }
}) 