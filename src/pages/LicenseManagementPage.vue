<template>
  <div class="license-management">
    <h2>License Management</h2>
    <div class="form">
      <label for="seatLicense">Seat-based licenses:</label>
      <input
        id="seatLicense"
        type="number"
        v-model.number="seatLicenses"
        min="0"
      />

      <label for="loginLicense">Login-based licenses:</label>
      <input
        id="loginLicense"
        type="number"
        v-model.number="loginLicenses"
        min="0"
      />

      <button @click="saveLicenses">Save Licenses</button>
    </div>
    <div class="summary">
      <h3>Current Config:</h3>
      <p>Seat Licenses: {{ seatLicenses }}</p>
      <p>Login-based Licenses: {{ loginLicenses }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const seatLicenses = ref(0)
const loginLicenses = ref(0)

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('licenseConfig'))
  if (saved) {
    seatLicenses.value = saved.seat
    loginLicenses.value = saved.login
  }
})

function saveLicenses() {
  localStorage.setItem(
    'licenseConfig',
    JSON.stringify({
      seat: seatLicenses.value,
      login: loginLicenses.value,
    })
  )
  alert('Licenses saved successfully!')
}
</script>

<style scoped>
.license-management {
  background: #44445f;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input {
  padding: 5px;
  border-radius: 5px;
}
button {
  padding: 10px;
  background: rgb(18, 182, 54);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.summary {
  margin-top: 20px;
}
@media (max-width: 768px) {
  .license-management {
    max-width: 100%;
  }
}
</style>
