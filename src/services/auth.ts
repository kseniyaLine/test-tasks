import axios from 'axios'
import { type User } from '../types/index'

const API_URL = import.meta.env.VITE_API_URL

export const loginUser = (user: User) => {
  return axios.post(`${API_URL}/login`, user)
}
export const registerUser = (
  newUser: User & {
    name: string
    password_confirmation: string
  }
) => {
  return axios.post(`${API_URL}/register`, newUser)
}
export const logoutUser = (token: string) => {
  return axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}
