<template>
  <div class="container mt-5">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" class="form-control" id="email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
      <p class="mt-3">Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const email = ref('')
    const password = ref('')

    const authStore = useAuthStore()

    const login = async () => {
      await authStore.login({ email: email.value, password: password.value })
    }

    return {
      email,
      password,
      login
    }
  }
})
</script>
