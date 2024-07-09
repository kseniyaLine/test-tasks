import { defineStore } from 'pinia'
import { type User } from '../types/index'
import { loginUser, registerUser, logoutUser } from '../services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    authenticated: false
  }),
  actions: {
    async login(userData: User) {
      try {
        const response = await loginUser(userData)

        if (typeof response.data === 'string') {
          const splitIndex = response.data.indexOf('}{') + 1
          const secondPart = response.data.substring(splitIndex)
          const secondObject = JSON.parse(secondPart)
          this.token = secondObject.token
        } else if (typeof response.data === 'object') {
          this.token = response.data.token
        }

        this.authenticated = true
        localStorage.setItem('token', this.token)
        window.location.href = '/'
      } catch (error) {
        alert(error)
      }
    },
    async register(
      userData: User & {
        name: string
        password_confirmation: string
      }
    ) {
      try {
        await registerUser(userData)
        window.location.href = '/login'
      } catch (error) {
        alert(error)
      }
    },
    async logout() {
      try {
        await logoutUser(this.token)
        window.location.href = '/login'
        this.clearUserData()
      } catch (error) {
        console.error(error)
      }
    },
    clearUserData() {
      this.authenticated = false
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})
