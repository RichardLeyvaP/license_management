<template>
    <v-card class="license-chart-card">
      <v-card-title class="text-h6">Distribuição de Licenças</v-card-title>
      <v-card-text>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
        <div class="legend-container">
          <div v-for="(item, index) in chartData.datasets[0].data" :key="index" class="legend-item">
            <span class="legend-color" :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
            <span>{{ chartData.labels[index] }}: {{ item }} ({{ calculatePercentage(item) }}%)</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
  
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend)
  
  const props = defineProps({
    licenseData: {
      type: Object,
      required: true,
      default: () => ({
        seatBased: 0,
        loginBased: 0
      })
    }
  })
  
  const chartCanvas = ref(null)
  let chartInstance = null
  
  const chartData = ref({
    labels: ['Seat-Based', 'Login-Based'],
    datasets: [{
      data: [props.licenseData.seatBased, props.licenseData.loginBased],
      backgroundColor: ['#4CAF50', '#2196F3'],
      borderWidth: 1
    }]
  })
  
  const calculatePercentage = (value) => {
    const total = props.licenseData.seatBased + props.licenseData.loginBased
    return total > 0 ? Math.round((value / total) * 100) : 0
  }
  
  const initChart = () => {
    if (chartInstance) {
      chartInstance.destroy()
    }
  
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: chartData.value,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || ''
                const value = context.raw || 0
                const percentage = calculatePercentage(value)
                return `${label}: ${value} (${percentage}%)`
              }
            }
          }
        },
        cutout: '70%'
      }
    })
  }
  
  onMounted(() => {
    setTimeout(initChart, 100)
  })
  
  watch(() => props.licenseData, (newVal) => {
    chartData.value.datasets[0].data = [newVal.seatBased, newVal.loginBased]
    if (chartInstance) {
      chartInstance.update()
    }
  }, { deep: true })
  </script>
  
  <style scoped>
  .license-chart-card {
    padding: 16px;
    height: 100%;
  }
  
  .chart-container {
    position: relative;
    height: 250px;
    margin-bottom: 20px;
  }
  
  .legend-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    display: inline-block;
  }
  </style>