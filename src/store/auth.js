import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  const login = (credentials) => {
    // Simulamos login: en una app real, se llamaría a la API
    if (credentials.username === 'admin' && credentials.password === '123456') {
      user.value = { name: 'Administrador', role: 'admin' }
      localStorage.setItem('user', JSON.stringify(user.value))
      router.push('/dashboard')
    } else {
      throw new Error('Credenciales incorrectas')
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
    router.push('/')
  }

  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return { user, login, logout, loadUserFromStorage }
})
