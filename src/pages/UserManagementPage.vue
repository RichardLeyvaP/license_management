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
        <li v-for="user in users" :key="user.username">
          {{ user.username }} ({{ user.licenseType }})
        </li>
      </ul>
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

const maxLoginUsers = () => {
  const licenses = JSON.parse(localStorage.getItem('licenseConfig')) || {}
  return (licenses.login || 0) * 3
}

onMounted(() => {
  users.value = JSON.parse(localStorage.getItem('users')) || []
})

function isValidUser() {
  const exists = users.value.some(u => u.username === username.value)
  const nameValid = /^[a-zA-Z0-9]{1,10}$/.test(username.value)
  const passValid = /^(?=.*[A-Z])(?=.*\d).{3,}$/.test(password.value)

  if (!nameValid) return alert('Invalid username (only alphanum, max 10)')
  if (exists) return alert('Username already exists')
  if (!passValid) return alert('Password must be 3+ chars with 1 uppercase and 1 digit')

  if (licenseType.value === 'seat') {
    const licenses = JSON.parse(localStorage.getItem('licenseConfig')) || {}
    const used = users.value.filter(u => u.licenseType === 'seat').length
    if (used >= (licenses.seat || 0)) return alert('No more seat licenses available')
  } else {
    const loginUsers = users.value.filter(u => u.licenseType === 'login').length
    if (loginUsers >= maxLoginUsers()) return alert('Login-based limit reached')
  }

  return true
}

function createUser() {
  if (!isValidUser()) return

  users.value.push({
    username: username.value,
    password: password.value,
    licenseType: licenseType.value,
    cpf: cpf.value || null,
    email: email.value || null,
  })

  localStorage.setItem('users', JSON.stringify(users.value))

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
  background: yellow;
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
</style>
