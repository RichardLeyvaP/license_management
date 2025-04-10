<template>
  <div class="login min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-white p-6">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-blue-700 mb-2">Bienvenido</h1>
        <p class="text-gray-600">Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="onLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Usuario</label>
          <input
            v-model="username"
            type="text"
            placeholder="Escribe tu usuario"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="Escribe tu contraseña"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de acceso</label>
          <input
            v-model="accessDate"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Entrar
        </button>

        <p v-if="error" class="text-red-600 text-center text-sm mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'

const username = ref('')
const password = ref('')
const accessDate = ref(new Date().toISOString().substring(0, 10)) // Fecha actual
const error = ref('')
const auth = useAuthStore()

const onLogin = async () => {
  try {
    await auth.login({
      username: username.value,
      password: password.value,
      date: accessDate.value
    })
    // router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  }
}
</script>
<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding-top: 100px;
}
input {
  display: block;
  margin-bottom: 10px;
  width: 100%;
  padding: 8px;
}
button {
  padding: 10px 20px;
  color: #000;
  background: #000;
}
</style>