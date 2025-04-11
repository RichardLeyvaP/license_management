<template>
  <v-dialog v-model="dialogModel" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5">Gestión de Licencias</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveLicenses" ref="licenseForm">
          <!-- Licencias Seat-Based -->
          <v-text-field
            v-model.number="seatLicenses"
            label="Licencias Seat-Based"
            type="number"
            min="1"
            :rules="seatLicenseRules"
            outlined
            class="mb-4"
          />
          
          <!-- Licencias Login-Based -->
          <v-text-field
            v-model.number="loginLicenses"
            label="Licencias Login-Based"
            type="number"
            :rules="loginLicenseRules"
            outlined
            class="mb-4"
          />
          
          <v-card-actions class="px-0">
            <v-spacer></v-spacer>
            <v-btn 
              color="red darken-1" 
              @click="closeDialog"
            >
              Cancelar
            </v-btn>
            <v-btn 
              color="green darken-1" 
              type="submit"
              :loading="loading"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-form>
        
        <v-divider class="my-4"></v-divider>
        
        <div class="summary">
          <h3 class="text-h6 mb-2">Configuración Actual:</h3>
          <p><strong>Licencias Seat-Based:</strong> {{ currentConfig.seatBased }}</p>
          <p><strong>Licencias Login-Based:</strong> {{ currentConfig.loginBased }}</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'  // Asegúrate de importar watch

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

// Modelos reactivos
const seatLicenses = ref(1)
const loginLicenses = ref(0)
const loading = ref(false)
const licenseForm = ref(null)

// Computed para v-model
const dialogModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// Configuración actual
const currentConfig = computed(() => {
  const saved = JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 1,
    loginBased: 0
  }
  return saved
})

// Reglas de validación
const seatLicenseRules = [
  v => !!v || 'Este campo es requerido',
  v => v >= 1 || 'Debe haber al menos 1 licencia (para el administrador)',
  v => Number.isInteger(v) || 'Debe ser un número entero'
]

const loginLicenseRules = [
  v => v >= 0 || 'No puede ser negativo',
  v => Number.isInteger(v) || 'Debe ser un número entero'
]

// Cargar configuración al abrir el diálogo
watch(dialogModel, (newVal) => {
  if (newVal) {
    const saved = JSON.parse(localStorage.getItem('license_config'))
    if (saved) {
      seatLicenses.value = saved.seatBased
      loginLicenses.value = saved.loginBased
    }
  }
})

function closeDialog() {
  dialogModel.value = false
}

async function saveLicenses() {
  const { valid } = await licenseForm.value.validate()
  if (!valid) return

  loading.value = true
  
  try {
    const config = {
      seatBased: seatLicenses.value,
      loginBased: loginLicenses.value,
    }
    
    localStorage.setItem('license_config', JSON.stringify(config))
    emit('saved', config)
    
    // Cerrar el diálogo después de guardar
    closeDialog()
    
  } catch (error) {
    console.error('Error al guardar licencias:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.summary {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>