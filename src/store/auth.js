import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)


  const login = ({ username, password, date }) => {
    const users = getUsers()

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    )

    if (!foundUser) {
      throw new Error('Credenciais incorretas')
    }

    if (!canUserLogin(username, foundUser.licenseType, date)) {
      throw new Error('Limite diário de acesso atingido para licenças Login-Based')
    }

    if (foundUser.licenseType === 'login-based') {
      recordUserLogin(username, date)
    }

    user.value = foundUser
    localStorage.setItem('user', JSON.stringify(user.value))
    router.push('/dashboard')
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
    router.push('/')
  }


  const getUsers = () => {
    const data = localStorage.getItem('users')
    return data ? JSON.parse(data) : []
  }

  const getLicenseConfig = () => {
    const data = localStorage.getItem('license_config')
    return data ? JSON.parse(data) : { seatBased: 0, loginBased: 0 }
  }

  const getDailyLogins = () => {
    const data = localStorage.getItem('daily_logins')
    return data ? JSON.parse(data) : {}
  }

  const saveDailyLogins = (logins) => {
    localStorage.setItem('daily_logins', JSON.stringify(logins))
  }

  const canUserLogin = (username, licenseType, accessDate) => {
    if (licenseType === 'seat-based') return true

    const dailyLogins = getDailyLogins()
    const todayLogins = dailyLogins[accessDate] || []

    if (todayLogins.includes(username)) return true // ya logueado hoy

    const { loginBased } = getLicenseConfig()
    return todayLogins.length < loginBased
  }

  const recordUserLogin = (username, accessDate) => {
    const dailyLogins = getDailyLogins()
    const todayLogins = dailyLogins[accessDate] || []

    if (!todayLogins.includes(username)) {
      todayLogins.push(username)
      dailyLogins[accessDate] = todayLogins
      saveDailyLogins(dailyLogins)
    }
  }

  

  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

   // Método para eliminar usuario
   const deleteUser = (usernameToDelete) => {
    try {
      // Obtener usuarios actuales
      const currentUsers = getUsers()
      
      // Verificar si el usuario que intenta eliminar es el mismo que está logueado
      if (user.value && user.value.username === usernameToDelete) {
        throw new Error('No puedes eliminarte a ti mismo mientras estás logueado')
      }
      
      // Filtrar el usuario a eliminar
      const updatedUsers = currentUsers.filter(u => u.username !== usernameToDelete)
      
      // Actualizar localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Si el usuario eliminado estaba logueado, forzar logout
      const deletedUserWasLoggedIn = user.value && user.value.username === usernameToDelete
      if (deletedUserWasLoggedIn) {
        logout()
      }
      
      return true // Indicar que la eliminación fue exitosa
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error // Re-lanzar el error para manejo en el componente
    }
  }

  // Método para obtener usuarios activos (puede incluir filtros)
  const getActiveUsers = (includeDeleted = false) => {
    const users = getUsers()
    return includeDeleted ? users : users.filter(u => !u.deleted)
  }

  return {
    user,
    login,
    logout,
    loadUserFromStorage,
    deleteUser, 
    getActiveUsers 
  }
})
