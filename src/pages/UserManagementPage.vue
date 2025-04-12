<template>
   <BaseSnackbar
  v-model="showSnackbar"
  :timeout="3000"
  :type="snackbarType"
  :icon="snackbarType === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'"
  :title="titleSnackbar"
  :message="messageSnackbar"
/>
  <v-dialog v-model="dialogModel" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">Crear Usuario</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit" ref="formRef">
          <!-- Campo Nombre de Usuario -->
          <v-text-field
            v-model="username"
            label="Nome de usuário"
            placeholder="Máx. 10 caracteres alfanuméricos"
            :rules="usernameRules"
            required
            @blur="checkUsernameExists"
          />

          <!-- Campo Contraseña -->
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            :rules="passwordRules"
            required
          />

          
          <v-select
            v-model="licenseType"
            :items="licenseTypes"
            label="Tipo de licença"
            :rules="[rules.required]"
            required
          />

          <!-- Campo CPF -->
          <v-text-field
            v-model="cpf"
            label="CPF (opcional)"
            :rules="cpfRules"
            placeholder="11 dígitos sem pontos ou hífens"
          />

          <!-- Campo Email -->
          <v-text-field
            v-model="email"
            label="E-mail (opcional)"
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
import { ref, computed,watch  } from 'vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'user-created'])

const messageSnackbar = ref('')
const snackbarType = ref('error')
const titleSnackbar = ref('')
const showSnackbar = ref(false)

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
  required: value => !!value || 'Campo obrigatório',
  usernameFormat: value => /^[a-zA-Z0-9]{1,10}$/.test(value) || 'Apenas caracteres alfanuméricos (máx. 10)',
  passwordLength: value => value.length >= 3 || 'Mínimo de 3 caracteres',
  passwordUpper: value => /[A-Z]/.test(value) || 'Deve conter pelo menos 1 letra maiúscula',
  passwordDigit: value => /\d/.test(value) || 'Deve conter pelo menos 1 número',
  passwordSpace: value => !/\s/.test(value) || 'Não pode conter espaços',
  emailFormat: value => !value || /.+@.+\..+/.test(value) || 'Email deve ser válido',
  cpfFormat: value => !value || /^\d{0,11}$/.test(value) || 'Apenas números (máx. 11 dígitos)'
}


const usernameRules = [
  rules.required,
  rules.usernameFormat,
  () => !usernameExists.value || 'Este usuário já existe'
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
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      loadUsers()
    }
  }
)

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
      return 'Não há mais licenças Seat-Based disponíveis'
    }
  } else {
    const loginUsers = users.value.filter(u => u.licenseType === 'login-based').length
    if (loginUsers >= getMaxLoginUsers()) {
      return 'Limite de usuários Login-Based atingido '
    }
  }
  return null
}

async function handleSubmit() {
  try {
    // Validación del formulario
    const { valid } = await formRef.value.validate()
    if (!valid) return

    // Verificar usuario existente
    if (users.value.some(u => u.username === username.value)) {

      messageSnackbar.value = 'Este nome de usuário já existe'
      snackbarType.value = 'warning'
      titleSnackbar.value = 'Alerta'
      showSnackbar.value = true
      
      return
    }

    // Verificar licencias
    const licenseError = checkLicenseAvailability()
    if (licenseError) {
     
      messageSnackbar.value = licenseError
      snackbarType.value = 'error'
      titleSnackbar.value = 'Error'
      showSnackbar.value = true

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
    
    emit('user-created', newUser)
    closeDialog()
    
    messageSnackbar.value = 'Usuário criado com sucesso!'
    snackbarType.value = 'success'
      titleSnackbar.value = 'Sucesso'
      showSnackbar.value = true
    
  } catch (error) {

    messageSnackbar.value = 'Ocorreu um erro ao criar o usuário'
      snackbarType.value = 'error'
      titleSnackbar.value = 'Erro'
      showSnackbar.value = true
  }
}
</script>