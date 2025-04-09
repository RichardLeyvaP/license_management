<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="onLogin">
      <input v-model="username" placeholder="Usuario" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const auth = useAuthStore()

const onLogin = async () => {
  try {
    await auth.login({ username: username.value, password: password.value })
  } catch (err) {
    error.value = err.message
  }
}
</script>
