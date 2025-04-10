<template>
  <v-snackbar class="mt-12" location="right top" :timeout="sb_timeout" :color="sb_type" elevation="24"
    :multi-line="true" vertical v-model="snackbar">
    <v-row>
      <v-col md="2">
        <v-avatar :icon="sb_icon" color="sb_type" size="40"></v-avatar>
      </v-col>
      <v-col md="10">
        <h4>{{ sb_title }}</h4>
        {{ sb_message }}
      </v-col>
    </v-row>
  </v-snackbar>

  <div
  class="d-flex align-center justify-center"
  style="min-height: 100%; background: linear-gradient(to bottom right, #90CAF9, #E3F2FD);"
>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        cols="11"
        sm="6"
        md="5"
        lg="4"
        xl="2"
      >
        <v-card elevation="10" class="pa-8" rounded="xl">
          <v-form ref="form" v-model="valid" enctype="multipart/form-data">
            <div class="text-center mb-6">
              <h2 class="text-h5 font-weight-bold text-blue">Bem-vindo</h2>
              <div class="text-subtitle-1 text-grey-darken-1">Entre para continuar</div>
            </div>

            <v-text-field
              v-model="editedItem.email"
              label="Usuário"
              prepend-inner-icon="mdi-account-circle-outline"
              variant="outlined"
              :density="$vuetify.display.smAndDown ? 'comfortable' : 'compact'"
            />

            <v-text-field
              v-model="editedItem.password"
              label="Senha"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              @click:append-inner="visible = !visible"
              variant="outlined"
              :density="$vuetify.display.smAndDown ? 'comfortable' : 'compact'"
            />

            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="editedItem.fecha"
                  label="Data"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                  @click="menu = true"
                  :append-inner-icon="menu ? 'mdi-menu-up' : 'mdi-menu-down'"
                  variant="outlined"
                  :density="$vuetify.display.smAndDown ? 'comfortable' : 'compact'"
                />
              </template>

              <v-date-picker
                v-model="editedItem.fecha"
                @update:model-value="onDateSelected"
                color="primary"
              />
            </v-menu>

            <v-btn
              block
              color="blue"
              class="mt-4"
              size="large"
              variant="tonal"
              :loading="loading"
              :disabled="!valid"
              @click="login"
            >
              Aceitar
            </v-btn>

            <v-divider class="mt-4 mb-2" />

            <div class="text-center text-caption text-grey-darken-1">
              Digiteam Field Service
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</div>

</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
export default {
  data: () => ({
    visible: false,
    loading: false,
    valid: true,
    snackbar: false,
    sb_type: '',
    sb_message: '',
    sb_timeout: 2000,
    sb_title: '',
    sb_icon: '',
    branches: [],
    user: [],
    data: {},
    editedItem: {
      password: '',
      branch_id: '',
      business_id: '',
      email: '',
      fecha: '',
    },
    menu: false,
    defaultItem: {
      password: '',
      branch_id: '',
      business_id: '',
      email: ''
    },
    requiredRules: [(v) => !!v || "El campo es requerido"],
  }),
  mounted() {
    this.editedItem.fecha = this.formatDate(new Date());
  },
  setup() {
    const username = ref('')
    const password = ref('')
    const accessDate = ref(new Date().toISOString().substring(0, 10))
    const error = ref('')
    const auth = useAuthStore()

    return {
      username,
      password,
      accessDate,
      error,
      auth
    }
  },
  methods: {
    setMenu() {
      this.menu = !this.menu;
    },
    formatDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }    ,
    onDateSelected(value) {
      this.editedItem.fecha = this.formatDate(value);
      this.menu = false;
    },

    showAlert(sb_type, sb_message, sb_timeout) {
      this.sb_type = sb_type;
      this.sb_timeout = sb_timeout;
      this.sb_message = sb_message;
      this.snackbar = true;

      const alertConfig = {
        success: { title: 'Éxito', icon: 'mdi-check-circle' },
        error: { title: 'Error', icon: 'mdi-alert-circle' },
        warning: { title: 'Advertencia', icon: 'mdi-alert' }
      };

      const config = alertConfig[sb_type] || {};
      this.sb_title = config.title || '';
      this.sb_icon = config.icon || '';
    },

    async login() {
      this.loading = true;
      try {
        this.data = {
          email: this.editedItem.email,
          password: this.editedItem.password,
          branch_id: this.editedItem.branch_id
        };


        await this.auth.login({
      username: this.editedItem.email,
      password: this.editedItem.password,
      date: this.accessDate
    })
        
      } catch (error) {
        this.showAlert('warning', error.message || 'Error inesperado', 2000);
      } finally {
        this.loading = false;
      }
    
    }
  }
}
</script>
