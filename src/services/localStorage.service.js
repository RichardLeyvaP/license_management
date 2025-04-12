// src/services/localStorage.service.js

export function initLocalStorage() {
    // Inicializar usuarios si no existen
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([
        { username: 'admin', password: 'Admin123', licenseType: 'seat-based' },
      ]))
    }
  
    // Inicializar configuración de licencias si no existe
    if (!localStorage.getItem('license_config')) {
      localStorage.setItem('license_config', JSON.stringify({
        seatBased: 1,
        loginBased: 0
      }))
    }
  }
  