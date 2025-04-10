// src/services/localStorage.service.js

export function initLocalStorage() {
    // Inicializar usuarios si no existen
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { username: 'admin', password: '123456', licenseType: 'seat-based' },
        { username: 'maria', password: '123', licenseType: 'login-based' },
        { username: 'jose', password: '123', licenseType: 'login-based' }
      ]))
    }
  
    // Inicializar configuración de licencias si no existe
    if (!localStorage.getItem('license_config')) {
      localStorage.setItem('license_config', JSON.stringify({
        seatBased: 2,
        loginBased: 1
      }))
    }
  }
  