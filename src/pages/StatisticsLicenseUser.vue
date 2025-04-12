<template>
  <v-card class="user-license-stats">
    <v-card-title class="text-h6">Usuários por tipo de licença</v-card-title>
    <v-card-text>
      <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="stats-summary">
        <v-chip v-for="(stat, index) in stats" :key="index" class="ma-2" :color="stat.color">
          {{ stat.label }}: {{ stat.value }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  licenseConfig: {
    type: Object,
    default: () => ({
      seatBased: 0,
      loginBased: 0
    })
  }
})

const chartCanvas = ref(null)
let chartInstance = null


const stats = computed(() => {
  const seatUsers = props.users.filter(u => u.licenseType === 'seat-based').length
  const loginUsers = props.users.filter(u => u.licenseType === 'login-based').length
  
  return [
    { label: 'Usuários Seat', value: seatUsers, color: '#4CAF50' },
    { label: 'Limite Seat', value: props.licenseConfig.seatBased, color: '#2E7D32' },
    { label: 'Usuários Login', value: loginUsers, color: '#2196F3' },
    { label: 'Limite Login', value: props.licenseConfig.loginBased * 3, color: '#1565C0' }
  ]
})

const chartData = computed(() => ({
  labels: ['Seat-Based', 'Login-Based'],
  datasets: [
    {
      label: 'Usuários Activos',
      data: [
        props.users.filter(u => u.licenseType === 'seat-based').length,
        props.users.filter(u => u.licenseType === 'login-based').length
      ],
      backgroundColor: ['#4CAF50', '#2196F3']
    },
    {
      label: 'Limite de licença',
      data: [
        props.licenseConfig.seatBased,
        props.licenseConfig.loginBased * 3
      ],
      backgroundColor: ['#A5D6A7', '#90CAF9'],
      borderColor: ['#2E7D32', '#1565C0'],
      borderWidth: 1
    }
  ]
}))

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: chartData.value,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantia'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Tipo de licença'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              const datasetLabel = context.dataset.label || ''
              const value = context.raw || 0
              return `${datasetLabel}: ${value}`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  setTimeout(initChart, 100)
})

watch([() => props.users, () => props.licenseConfig], () => {
  if (chartInstance) {
    chartInstance.data = chartData.value
    chartInstance.update()
  }
}, { deep: true })
</script>

<style scoped>
.user-license-stats {
  padding: 16px;
  margin-top: 20px;
}

.chart-container {
  position: relative;
  height: 170px;
  margin-bottom: 20px;
}

.stats-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
</style>