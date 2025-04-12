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
      throw new Error('Limite de acesso diário definido para licenças baseadas em login')
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

  
   const deleteUser = (usernameToDelete) => {
    try {
      const currentUsers = getUsers()
      
      if (user.value && user.value.username === usernameToDelete) {
        throw new Error('Você não pode se excluir enquanto estiver logado.')
      }
      
      const updatedUsers = currentUsers.filter(u => u.username !== usernameToDelete)
      
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      const deletedUserWasLoggedIn = user.value && user.value.username === usernameToDelete
      if (deletedUserWasLoggedIn) {
        logout()
      }
      return true 
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      throw error 
    }
  }

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
