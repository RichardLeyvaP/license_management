
<template>
  <v-layout>
   <!-- Menú lateral -->
<v-navigation-drawer app v-model="drawer" temporary>
  <v-list dense>
    <v-list-item>
      <v-list-item-title class="text-h6">Menú</v-list-item-title>
    </v-list-item>

    <v-divider class="my-2" />

    <v-list-item link @click="openUserManagement">
          <v-list-item-title>
            <v-icon>mdi-account-group</v-icon> Usuários
          </v-list-item-title>
        </v-list-item>

    <v-list-item link @click="openLicenseManagement">
          <v-list-item-title>
            <v-icon>mdi-certificate</v-icon> Licenças
          </v-list-item-title>
        </v-list-item>

  </v-list>
</v-navigation-drawer>

 
 <UserCreateDialog 
      v-model="userDialog"
      @user-created="handleUserCreated"
    />

    <LicenseManagementDialog 
      v-model="licenseDialog"
      @saved="handleLicenseSaved"
    />

    

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="showModal" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de eliminar al usuario {{ userToDelete }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="cancelDelete">Cancelar</v-btn>
          <v-btn color="red" @click="deleteUser">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Barra superior -->
    <v-app-bar color="info" density="comfortable" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title  >Digiteam Field Service</v-app-bar-title>

      <v-spacer />

      <v-btn color="#ffffff"   class="mr-2">
        <v-icon left>mdi-account-circle</v-icon>
        {{ auth.user.username }}        
      </v-btn>

      <v-btn color="error" @click="logout" class="mr-4">
        <v-icon left>mdi-logout</v-icon>
        Cerrar sesión
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-container>
    <v-main>
      
        
        <v-row>
          <v-col cols="12" md="4" class="mx-auto">
            <v-card
              class="mb-4"
              density="compact"
              prepend-icon="mdi-chart-pie"
              title="Estatísticas"
              variant="text"
              border
            >

         <v-row>
      <v-col cols="12" md="12">
        <LicenseChart :license-data="licenseStats" />
      </v-col>
    </v-row> 
     <!-- O gráfico combinado -->
    

            </v-card>
          </v-col>

          <v-col cols="12" md="4" class="mx-auto">
            <v-card
              class="mb-4"
              density="compact"
               prepend-icon="mdi-chart-bar"
              title="Estatísticas"
              variant="text"
              border
            >
           <CombinedLicenseStats
            :users="userList"
            :license-config="licenseConfig"
          />
           </v-card>
                </v-col>

          <v-col cols="12" md="4" class="mx-auto">
         
            <v-card
              class="mb-4"
              density="comfortable"
              prepend-icon="mdi-account-group"
              title="Usuários"
              variant="text"
              border
            >
              

              <v-card-text>
                <!-- Lista de usuarios (opcional) -->
    <v-table v-if="users.length > 0">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Tipo de Licencia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.username">
  <td>{{ user.username }}</td>
  <td>{{ user.licenseType }}</td>
  <td>
    <v-btn
      v-if="user.username !== 'admin'"
      icon
      @click="confirmDelete(user.username)"
    >
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>
  </td>
</tr>

      </tbody>
    </v-table>
              </v-card-text>

             
            </v-card>
          </v-col>
          
        </v-row>
    </v-main>
    </v-container>
  </v-layout>
</template>









<script setup>
import { useAuthStore } from '../store/auth'
import UserCreateDialog from '@/pages/UserManagementPage.vue'
import LicenseManagementDialog  from '@/pages/LicenseManagementPage.vue'
import LicenseChart from '@/pages/StatisticsLicense.vue'
import CombinedLicenseStats from '@/pages/StatisticsLicenseUser.vue'
const userList = ref([])
const licenseConfig = ref({ seatBased: 0, loginBased: 0 })
import { ref, onMounted } from 'vue'

const drawer = ref(false)


const auth = useAuthStore()
const licenseStats = ref({
  seatBased: 0,
  loginBased: 0
})

const users = ref([])
const showModal = ref(false)
const userToDelete = ref(null)
const userDialog = ref(false)
const licenseDialog = ref(false)

function openUserManagement() {
  userDialog.value = true
  drawer.value = false
}
function openLicenseManagement() {
  licenseDialog.value = true
  drawer.value = false
}

onMounted(() => {
  // Cargar usuarios iniciales
  users.value = JSON.parse(localStorage.getItem('users')) || []

  const saved = JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 1,
    loginBased: 0
  }
  licenseStats.value = saved


  userList.value = JSON.parse(localStorage.getItem('users')) || []
  licenseConfig.value = JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 1,
    loginBased: 0
  }
})

function handleUserCreated(newUser) {
  // Actualizar lista local de usuarios
  users.value = JSON.parse(localStorage.getItem('users')) || []
}

function handleLicenseSaved(config) {
  const saved = JSON.parse(localStorage.getItem('license_config')) || {
    seatBased: 1,
    loginBased: 0
  }
  licenseStats.value = saved
 
}

async function confirmDelete(username) {
  try {
    const success = await auth.deleteUser(username)
    if (success) {
      alert('Usuario eliminado con éxito')
      // Actualizar lista local
      users.value = auth.getActiveUsers()
      alert(users.value)
      // Mostrar notificación de éxito
    }
  } catch (error) {
    alert('Error al eliminar el usuario: ' + error.message)
    // Mostrar error al usuario
    console.error(error.message)
  }
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

const logout = () => {
  auth.logout()
}



</script>
<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: sans-serif;
  background-color: #1e1e2f;
  color: white;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  background: #2c2c3e;
  width: 200px;
  padding: 10px;
  transition: width 0.3s;
}

.sidebar.collapsed {
  width: 60px;
}

.toggle-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  padding: 10px 5px;
  cursor: pointer;
}

.icon {
  margin-right: 10px;
}

/* Main */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* AppBar */
.appbar {
  height: 50px;
  background: #33334f;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 20px;
}

/* Content */
.content {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  flex-wrap: wrap;
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(2, 80px);
  grid-template-rows: repeat(2, 80px);
  gap: 20px;
}

.card {
  background: #44445f;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dynamic Content */
.dynamic-content {
  background: #555578;
  flex-grow: 1;
  border-radius: 10px;
  padding: 20px;
  min-width: 200px;
}

/* 🔥 Responsiveness */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .main {
    flex-direction: column;
  }

  .content {
    flex-direction: column;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .card {
    width: 100%;
    height: 60px;
  }

  .dynamic-content {
    width: 100%;
  }
}
</style>
