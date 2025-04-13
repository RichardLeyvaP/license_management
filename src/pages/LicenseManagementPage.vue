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
      <v-card-title class="text-h5">Gerenciamento de licenças</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveLicenses" ref="licenseForm">
          
          <v-text-field
            v-model.number="seatLicenses"
            label="Licencias Seat-Based"
            type="number"
            min="1"
            :rules="seatLicenseRules"
            outlined
            class="mb-4"
          />
          
          
          <v-text-field
            v-model.number="loginLicenses"
            label="Licencias Login-Based"
            type="number"
            :rules="loginLicenseRules"
            outlined
            class="mb-4"
          />
          
            <v-row>
  <v-col class="text-left">
    <v-btn color="red" class="mt-2" @click="closeDialog">Cancelar</v-btn>
  </v-col>
  <v-col class="text-right">
    <v-btn type="submit" color="green" class="mt-2">Guardar</v-btn>
  </v-col>
</v-row>



        </v-form>
        
        <v-divider class="my-4"></v-divider>
        
        <div class="summary">
          <h3 class="text-h6 mb-2">Configuração atual:</h3>
          <p><strong>Licenças Seat-Based:</strong> {{ currentConfig.seatBased }}</p>
          <p><strong>Licenças Login-Based:</strong> {{ currentConfig.loginBased }}</p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue' 
import BaseSnackbar from '@/components/BaseSnackbar.vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const showSnackbar = ref(false)
const messageSnackbar = ref('')
const titleSnackbar = ref('')
const snackbarType = ref('success')


const seatLicenses = ref(1)
const loginLicenses = ref(0)
const loading = ref(false)
const licenseForm = ref(null)


const dialogModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})


const currentConfig = computed(() => {
  const saved = JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 1,
    loginBased: 0
  }
  return saved
})


const seatLicenseRules = [
  v => !!v || 'Este campo é obrigatório',
  v => v >= 1 || 'Deve haver pelo menos 1 licença (para o administrador)',
  v => Number.isInteger(v) || 'Deve ser um inteiro'
]

const loginLicenseRules = [
  v => v >= 0 || 'Não pode ser negativo',
  v => Number.isInteger(v) || 'Deve ser um inteiro'
]

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

    const totalSeatUsers = getUsersCountByLicenseType('seat-based') // función ficticia que debes implementar
    const totalLoginUsers = getUsersCountByLicenseType('login-based') // función ficticia que debes implementar

    const requiredLoginLicenses = Math.ceil(totalLoginUsers / 3)

    if (seatLicenses.value < totalSeatUsers) {

      messageSnackbar.value = `Não é possível salvar. Existem ${totalSeatUsers} usuários usando a licença Seat-Based, e você está tentando definir ${seatLicenses.value} licenças.`
      snackbarType.value = 'error'
      titleSnackbar.value = 'Erro'
      showSnackbar.value = true
       loading.value = false

      return
    }

    if (loginLicenses.value < requiredLoginLicenses) {
      messageSnackbar.value = `Não é possível salvar. Existem ${totalLoginUsers} usuários usando a licença Login-Based. Para essa quantidade, são necessárias pelo menos ${requiredLoginLicenses} licenças.`
      snackbarType.value = 'error'
      titleSnackbar.value = 'Erro'
      showSnackbar.value = true
       loading.value = false
      return
    }

    const config = {
      seatBased: seatLicenses.value,
      loginBased: loginLicenses.value,
    }

    localStorage.setItem('license_config', JSON.stringify(config))
    emit('saved', config)
    messageSnackbar.value = 'Licenças salvas com sucesso'
      snackbarType.value = 'success'
      titleSnackbar.value = 'Sucesso'
      showSnackbar.value = true
       loading.value = false
    closeDialog()

  } catch (error) {
    console.error('Erro ao salvar licenças:', error)
  } finally {
    loading.value = false
  }
}

function getUsersCountByLicenseType(type) {
  // Simula que obtienes usuarios según el tipo
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  return users.filter(user => user.licenseType === type).length
}



/*
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
    
   
    closeDialog()
    
  } catch (error) {
    console.error('Error al guardar licencias:', error)
  } finally {
    loading.value = false
  }
}*/
</script>

<style scoped>
.summary {
  margin-top: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>