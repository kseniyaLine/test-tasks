<template>
  <div class="container mt-5">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="name" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" class="form-control" id="email" v-model="email" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" v-model="password" required />
      </div>
      <div class="mb-3">
        <label for="password_confirmation" class="form-label">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="password_confirmation"
          v-model="passwordConfirmation"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
      <p class="mt-3">Already have an account? <router-link to="/login">Login</router-link></p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const authStore = useAuthStore()
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const passwordConfirmation = ref('')

    const handleRegister = async () => {
      await authStore.register({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: passwordConfirmation.value
      })
    }

    return {
      name,
      email,
      password,
      passwordConfirmation,
      handleRegister
    }
  }
})
</script>
