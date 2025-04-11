<template>
  <v-dialog v-model="dialogModel" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">Crear Usuario</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <!-- Campo Nombre de Usuario -->
          <v-text-field
            v-model="username"
            label="Nombre de Usuario"
            placeholder="Máx. 10 caracteres alfanuméricos"
            :rules="usernameRules"
            required
            @blur="checkUsernameExists"
          />

          <!-- Campo Contraseña -->
          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            :rules="passwordRules"
            required
          />

          <!-- Selector de Tipo de Licencia -->
          <v-select
            v-model="licenseType"
            :items="licenseTypes"
            label="Tipo de Licencia"
            :rules="[rules.required]"
            required
          />

          <!-- Campo CPF -->
          <v-text-field
            v-model="cpf"
            label="CPF (opcional)"
            :rules="cpfRules"
            placeholder="11 dígitos sin puntos ni guiones"
          />

          <!-- Campo Email -->
          <v-text-field
            v-model="email"
            label="Email (opcional)"
            :rules="emailRules"
            type="email"
          />

          <v-btn type="submit" color="green" class="mt-4">Crear Usuario</v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="red" @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'user-created'])

// Modelos reactivos
const username = ref('')
const password = ref('')
const licenseType = ref('seat')
const cpf = ref('')
const email = ref('')
const users = ref([])
const formRef = ref(null)
const usernameExists = ref(false)

const licenseTypes = [
  { title: 'Licencia Seat-Based', value: 'seat' },
  { title: 'Licencia Login-Based', value: 'login' }
]

// Reglas de validación
const rules = {
  required: value => !!value || 'Campo requerido',
  usernameFormat: value => /^[a-zA-Z0-9]{1,10}$/.test(value) || 'Solo caracteres alfanuméricos (máx. 10)',
  passwordLength: value => value.length >= 3 || 'Mínimo 3 caracteres',
  passwordUpper: value => /[A-Z]/.test(value) || 'Debe contener al menos 1 mayúscula',
  passwordDigit: value => /\d/.test(value) || 'Debe contener al menos 1 número',
  passwordSpace: value => !/\s/.test(value) || 'No puede contener espacios',
  emailFormat: value => !value || /.+@.+\..+/.test(value) || 'Email debe ser válido',
  cpfFormat: value => !value || /^\d{0,11}$/.test(value) || 'Solo números (máx. 11 dígitos)'
}

const usernameRules = [
  rules.required,
  rules.usernameFormat,
  () => !usernameExists.value || 'Este usuario ya existe'
]

const passwordRules = [
  rules.required,
  rules.passwordLength,
  rules.passwordUpper,
  rules.passwordDigit,
  rules.passwordSpace
]

const emailRules = [
  rules.emailFormat
]

const cpfRules = [
  rules.cpfFormat
]

// Computed para el v-model
const dialogModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// Cargar usuarios al montar
onMounted(() => {
  loadUsers()
})

function loadUsers() {
  users.value = JSON.parse(localStorage.getItem('users')) || []
}

function checkUsernameExists() {
  if (!username.value) return
  usernameExists.value = users.value.some(u => u.username === username.value)
}

function closeDialog() {
  dialogModel.value = false
  resetForm()
}

function resetForm() {
  username.value = ''
  password.value = ''
  licenseType.value = 'seat'
  cpf.value = ''
  email.value = ''
  usernameExists.value = false
  formRef.value?.resetValidation()
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

function checkLicenseAvailability() {
  const config = getLicenseConfig()
  
  if (licenseType.value === 'seat') {
    const used = users.value.filter(u => u.licenseType === 'seat-based').length
    if (used >= config.seatBased) {
      return 'No hay más licencias Seat-Based disponibles'
    }
  } else {
    const loginUsers = users.value.filter(u => u.licenseType === 'login-based').length
    if (loginUsers >= getMaxLoginUsers()) {
      return 'Límite de usuarios Login-Based alcanzado'
    }
  }
  return null
}

function createUser() {
  // Validar formulario
  const formValid = formRef.value.validate()
  if (!formValid.valid) return
  
  // Verificar disponibilidad de licencia
  const licenseError = checkLicenseAvailability()
  if (licenseError) {
    alert(licenseError)
    return
  }

  // Verificar si el usuario ya existe
  if (users.value.some(u => u.username === username.value)) {
    alert('Este nombre de usuario ya existe')
    return
  }

  // Crear nuevo usuario
  const newUser = {
    username: username.value,
    password: password.value,
    licenseType: licenseType.value === 'seat' ? 'seat-based' : 'login-based',
    cpf: cpf.value || null,
    email: email.value || null,
    createdAt: new Date().toISOString()
  }

  // Guardar usuario
  users.value.push(newUser)
  localStorage.setItem('users', JSON.stringify(users.value))
  
  // Emitir evento y limpiar formulario
  emit('user-created', newUser)
  closeDialog()
}
async function handleSubmit() {
  try {
    // Validación del formulario
    const { valid } = await formRef.value.validate()
    if (!valid) return

    // Verificar usuario existente
    if (users.value.some(u => u.username === username.value)) {
      alert('Este nombre de usuario ya existe')
      return
    }

    // Verificar licencias
    const licenseError = checkLicenseAvailability()
    if (licenseError) {
      alert(licenseError)
      return
    }

    // Crear nuevo usuario
    const newUser = {
      username: username.value,
      password: password.value,
      licenseType: licenseType.value === 'seat' ? 'seat-based' : 'login-based',
      cpf: cpf.value || null,
      email: email.value || null,
      createdAt: new Date().toISOString()
    }

    // Guardar usuario
    users.value.push(newUser)
    localStorage.setItem('users', JSON.stringify(users.value))
    
    // Notificar y limpiar
    emit('user-created', newUser)
    closeDialog()
    
    alert('Usuario creado exitosamente!')
    
  } catch (error) {
    console.error('Error al crear usuario:', error)
    alert('Ocurrió un error al crear el usuario')
  }
}
</script>