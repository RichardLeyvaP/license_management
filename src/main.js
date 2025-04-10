// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/auth'
import { initLocalStorage } from './services/localStorage.service' 


initLocalStorage()
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)


const authStore = useAuthStore()
authStore.loadUserFromStorage()

app.mount('#app')
