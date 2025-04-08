// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/DashboardPage.vue'),
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('../pages/UserManagementPage.vue'),
  },
  {
    path: '/licenses',
    name: 'LicenseManagement',
    component: () => import('../pages/LicenseManagementPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
