
<template>
  <v-layout>
   <!-- Menú lateral -->
<v-navigation-drawer app v-model="drawer" temporary>
  <v-list dense>
    <v-list-item>
      <v-list-item-title class="text-h6">Menú</v-list-item-title>
    </v-list-item>

    <v-divider class="my-2" />

    <v-list-item link @click="openModal('Gerenciamento de usuários')">
      <v-list-item-title><v-icon>mdi-account-group</v-icon> Usuários</v-list-item-title>

</v-list-item>


    <v-list-item link @click="openModal(' Gerenciamento de licenças')">
      
      <v-list-item-title><v-icon>mdi-certificate</v-icon> Licenças</v-list-item-title>

    </v-list-item>
  </v-list>
</v-navigation-drawer>

<!-- Componente del diálogo -->
<UserCreateDialog
      v-model="dialog"
      @create-user="handleCreateUser"
    />

    <!-- Barra superior -->
    <v-app-bar color="info" density="comfortable" app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-app-bar-title  >Digiteam Field Service</v-app-bar-title>

      <v-spacer />

      <v-btn color="error" @click="logout" class="mr-4">
        <v-icon left>mdi-logout</v-icon>
        Cerrar sesión
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-container>
    <v-main>
      <v-container fluid class="pa-4">
        <v-row>
          <v-col cols="12" md="6" class="mx-auto">
            <v-card
              class="mb-4"
              density="compact"
              prepend-avatar="https://randomuser.me/api/portraits/women/10.jpg"
              subtitle="Salsa, merengue, y cumbia"
              title="Cuba"
              variant="text"
              border
            >
              <v-img height="180" src="https://picsum.photos/512/128?image=660" cover />

              <v-card-text>
                During my last trip to South America, I spent 2 weeks traveling through Patagonia in Chile.
              </v-card-text>

              <template v-slot:actions>
                <v-btn color="primary" variant="text">View More</v-btn>
                <v-btn color="primary" variant="text">See in Map</v-btn>
              </template>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="mx-auto">
            <v-card
              class="mb-4"
              density="comfortable"
              prepend-avatar="https://randomuser.me/api/portraits/women/17.jpg"
              subtitle="Salsa, merengue, y cumbia"
              title="Florida"
              variant="text"
              border
            >
              <v-img height="180" src="https://picsum.photos/512/128?random" cover />

              <v-card-text>
                During my last trip to Florida, I spent 2 weeks traveling through the Everglades.
              </v-card-text>

              <template v-slot:actions>
                <v-btn color="primary" variant="text">View More</v-btn>
                <v-btn color="primary" variant="text">See in Map</v-btn>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    </v-container>
  </v-layout>
</template>









<script setup>
import { ref } from 'vue'
import LicenseManagementPage from '@/pages/LicenseManagementPage.vue'
import UserManagementPage from '@/pages/UserManagementPage.vue'
import { useAuthStore } from '../store/auth'
import UserCreateDialog from '@/pages/usser/usser.page.vue'

const drawer = ref(false)
const dialog = ref(false)
const modalContent = ref('')


const auth = useAuthStore()

const isCollapsed = ref(false)
const selectedView = ref(null)

const logout = () => {
  auth.logout()
}



function openModal(content) {
  modalContent.value = content
  dialog.value = true
  drawer.value = false 
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
