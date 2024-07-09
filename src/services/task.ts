import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const headers = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export const getTasks = (token: string, page: number) => {
  return axios.get(`${API_URL}/tasks`, {
    params: { page },
    ...headers(token)
  })
}
export const createTask = (
  task: { title: string; description: string; created_at: string },
  token: string
) => {
  return axios.post(`${API_URL}/tasks`, task, {
    ...headers(token)
  })
}
export const updateTask = (
  taskId: number,
  task: { title: string; description: string },
  token: string
) => {
  return axios.put(`${API_URL}/tasks/${taskId}`, task, {
    ...headers(token)
  })
}
export const deleteTask = (taskId: number, token: string) => {
  return axios.delete(`${API_URL}/tasks/${taskId}`, {
    ...headers(token)
  })
}
export const changeTaskStatus = (taskId: number, status: string, token: string) => {
  return axios.patch(
    `${API_URL}/tasks/${taskId}/transition`,
    { status },
    {
      ...headers(token)
    }
  )
}
