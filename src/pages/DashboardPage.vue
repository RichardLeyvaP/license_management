<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside :class="{ collapsed: isCollapsed }" class="sidebar">
      <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
        <span v-if="isCollapsed">☰</span>
        <span v-else>✖</span>
      </button>
      <ul>
        <li @click="selectedView = 'licenses'">
          <i class="icon">🔐</i>
          <span v-if="!isCollapsed">Gestión de Licencias</span>
        </li>
        <li @click="selectedView = 'users'">
          <i class="icon">👥</i>
          <span v-if="!isCollapsed">Gestión de Usuarios</span>
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="main">
      <!-- AppBar -->
      <header class="appbar">
  <div class="left-section">
    <i class="icon">🔔</i>
  </div>
  <div class="right-section">
    <img src="https://es.vidnoz.com/img/ai-talking-avatar/tips-default.png" alt="avatar" class="avatar" />
    <button @click="logout" class="logout-btn" title="Salir">⏻</button>

  </div>
</header>


      <!-- Content Area -->
      <div class="content">
        <!-- Responsive Cards (optional preview) -->
        <div class="cards">
          <div class="card">Card 1</div>
          <div class="card">Card 2</div>
          <div class="card">Card 3</div>
          <div class="card">Card 4</div>
        </div>

        <!-- Dynamic Content -->
        <div class="dynamic-content">
          <div v-if="selectedView === 'licenses'">
            <LicenseManagementPage />
          </div>
          <div v-else-if="selectedView === 'users'">
            <UserManagementPage />
          </div>
          <div v-else>
            <h2>Bienvenido</h2>
            <p>Selecciona una opción del menú.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LicenseManagementPage from '@/pages/LicenseManagementPage.vue'
import UserManagementPage from '@/pages/UserManagementPage.vue'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()

const isCollapsed = ref(false)
const selectedView = ref(null)

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
