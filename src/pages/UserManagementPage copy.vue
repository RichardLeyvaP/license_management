<template>
  <div class="user-management">
    <h2>User Management</h2>
    <form @submit.prevent="createUser">
      <label>Username:</label>
      <input v-model="username" placeholder="Max 10 chars" />
      <label>Password:</label>
      <input type="password" v-model="password" />
      <label>License Type:</label>
      <select v-model="licenseType">
        <option value="seat">Seat-based</option>
        <option value="login">Login-based</option>
      </select>
      <label>CPF:</label>
      <input v-model="cpf" />
      <label>Email:</label>
      <input v-model="email" />

      <button type="submit">Create User</button>
    </form>

    <div class="user-list">
  <h3>Registered Users:</h3>
  <ul>
    <li v-for="user in users" :key="user.username" class="user-item">
  <span>{{ user.username }} ({{ user.licenseType }})</span>

  <span
    v-if="user.username !== 'admin'"
    class="delete-icon"
    @click="confirmDelete(user.username)"
  >
    <span class="material-icons">delete</span>
  </span>
</li>
  </ul>
</div>

<div v-if="showModal" class="modal-overlay">
  <div class="modal">
    <p>¿Estás seguro de que quieres eliminar al usuario <strong>{{ userToDelete }}</strong>?</p>
    <div class="modal-actions">
      <button @click="deleteUser">Sí, eliminar</button>
      <button @click="cancelDelete">Cancelar</button>
    </div>
  </div>
</div>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref('')
const password = ref('')
const licenseType = ref('seat')
const cpf = ref('')
const email = ref('')
const users = ref([])
const showModal = ref(false)
const userToDelete = ref(null)




onMounted(() => {
  users.value = JSON.parse(localStorage.getItem('users')) || []
})

function confirmDelete(username) {
  userToDelete.value = username
  showModal.value = true
}

function cancelDelete() {
  showModal.value = false
  userToDelete.value = null
}

function deleteUser() {
  users.value = users.value.filter(u => u.username !== userToDelete.value)
  localStorage.setItem('users', JSON.stringify(users.value))
  cancelDelete()
}

function getLicenseConfig() {
  return JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 0,
    loginBased: 0
  }
}

function getMaxLoginUsers() {
  const config = getLicenseConfig()
  return config.loginBased * 3
}

function isValidUser() {
  const exists = users.value.some(u => u.username === username.value)
  const nameValid = /^[a-zA-Z0-9]{1,10}$/.test(username.value)
  const passValid = /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(password.value)

  if (!nameValid) {
    alert('Nombre de usuario inválido (solo alfanumérico, máx. 10 caracteres)')
    return false
  }
  if (exists) {
    alert('Este nombre de usuario ya existe')
    return false
  }
  if (!passValid) {
    alert('Contraseña inválida (mín. 3 caracteres, 1 mayúscula y 1 número)')
    return false
  }

  const config = getLicenseConfig()

  if (licenseType.value === 'seat') {
    const used = users.value.filter(u => u.licenseType === 'seat-based').length
    if (used >= config.seatBased) {
      alert('No hay más licencias Seat-Based disponibles')
      return false
    }
  } else {
    const loginUsers = users.value.filter(u => u.licenseType === 'login-based').length
    if (loginUsers >= getMaxLoginUsers()) {
      alert('Límite de usuarios Login-Based alcanzado')
      return false
    }
  }

  return true
}

function createUser() {
  if (!isValidUser()) return

  const newUser = {
    username: username.value,
    password: password.value,
    licenseType: licenseType.value === 'seat' ? 'seat-based' : 'login-based',
    cpf: cpf.value || null,
    email: email.value || null,
  }

  users.value.push(newUser)
  localStorage.setItem('users', JSON.stringify(users.value))

  // Limpiar campos
  username.value = ''
  password.value = ''
  cpf.value = ''
  email.value = ''
  licenseType.value = 'seat'
}
</script>


<style scoped>
.user-management {
  background: #44445f;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input,
select {
  padding: 8px;
  border-radius: 5px;
}

button {
  background: rgb(18, 182, 54);
  ;
  padding: 10px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-list {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .user-management {
    max-width: 100%;
  }
}

/* para el modal */
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.delete-icon {
  color: red;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.modal-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: red;
  color: white;
}

.modal-actions button:last-child {
  background-color: #ccc;
}

</style>
