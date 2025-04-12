<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: String,
  message: String,
  icon: String,
  type: {
    type: String,
    default: 'success'
  }
})
</script>

<template>
  <v-snackbar
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', false)"
    :timeout="3000"
    :color="props.type === 'error' ? 'red darken-2' : 'green darken-2'"
    location="top right"
  >
    <v-row no-gutters>
      <v-col cols="auto">
        <v-icon>{{ props.icon }}</v-icon>
      </v-col>
      <v-col class="ml-3">
        <strong v-if="props.title">{{ props.title }}</strong>
        <div v-if="props.message">{{ props.message }}</div>
      </v-col>
      <v-col cols="auto">
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-snackbar>
</template>
