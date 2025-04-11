<template>
  <v-dialog v-model="internalDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">Crear Usuario</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm" ref="formRef">
          <v-text-field
            v-model="formData.username"
            label="Nombre de Usuario"
            placeholder="Max 10 caracteres"
            required
          />
          <v-text-field
            v-model="formData.password"
            label="Contraseña"
            type="password"
            required
          />
          <v-select
            v-model="formData.licenseType"
            :items="licenseTypes"
            label="Tipo de Licencia"
            required
          />
          <v-text-field v-model="formData.cpf" label="CPF" />
          <v-text-field v-model="formData.email" label="Email" />
          
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
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dialog', 'create-user'])

const internalDialog = ref(props.dialog)
const formRef = ref(null)
const formData = ref({
  username: '',
  password: '',
  licenseType: 'seat',
  cpf: '',
  email: ''
})

const licenseTypes = ref([
  { title: 'Licencia Seat-Based', value: 'seat' },
  { title: 'Licencia Login-Based', value: 'login' }
])

watch(() => props.dialog, (newVal) => {
  internalDialog.value = newVal
})

watch(internalDialog, (newVal) => {
  if (!newVal) {
    emit('update:dialog', false)
  }
})

function closeDialog() {
  internalDialog.value = false
}

function submitForm() {
  emit('create-user', formData.value)
  resetForm()
}

function resetForm() {
  formData.value = {
    username: '',
    password: '',
    licenseType: 'seat',
    cpf: '',
    email: ''
  }
}
</script>