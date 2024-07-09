import { defineStore } from 'pinia'
import { type Task } from '../types/index'
import { getTasks, createTask, updateTask, deleteTask, changeTaskStatus } from '../services/task'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalTasks: 0
  }),
  actions: {
    async fetchTasks() {
      try {
        let currentPage = 1
        let allTasks: Task[] = []

        for (;;) {
          const response = await getTasks(useAuthStore().token, currentPage)
          const tasks = response.data.data
          allTasks = [...allTasks, ...tasks]
          if (!response.data.next_page_url) {
            break
          }
          currentPage++
        }

        this.tasks = allTasks
        this.currentPage = currentPage
        this.totalPages = currentPage
        this.perPage = allTasks.length
        this.totalTasks = allTasks.length
      } catch (error) {
        console.error('Error fetching tasks:', error)
        throw error
      }
    },
    async createTask(task: Task) {
      try {
        const response = await createTask(task, useAuthStore().token)
        if (typeof response.data === 'string') {
          const splitIndex = response.data.indexOf('}{') + 1
          const secondPart = response.data.substring(splitIndex)
          const secondObject = JSON.parse(secondPart)
          this.tasks.push(secondObject)
        } else if (typeof response.data === 'object') {
          this.tasks.push(response.data)
        }
      } catch (error) {
        console.error('Error creating task:', error)
        throw error
      }
    },
    async updateTask(task: Task) {
      try {
        const response = await updateTask(Number(task.id), task, useAuthStore().token)

        let taskData: Task = {
          title: '',
          description: '',
          created_at: '',
          status: 0
        }

        if (typeof response.data === 'string') {
          const splitIndex = response.data.indexOf('}{') + 1
          const secondPart = response.data.substring(splitIndex)
          taskData = JSON.parse(secondPart)
        } else if (typeof response.data === 'object') {
          taskData = response.data
        }
        const index = this.tasks.findIndex((t) => t.id === task.id)
        if (index !== -1) {
          this.tasks[index] = taskData
        }
      } catch (error) {
        console.error('Error updating task:', error)
        throw error
      }
    },
    async deleteTask(taskId: number) {
      try {
        await deleteTask(taskId, useAuthStore().token)
        this.tasks = this.tasks.filter((t) => t.id !== taskId)
      } catch (error) {
        console.error('Error deleting task:', error)
        throw error
      }
    },
    async changeTaskStatus(taskId: number, status: string) {
      try {
        const response = await changeTaskStatus(taskId, status, useAuthStore().token)

        let taskData: Task = {
          title: '',
          description: '',
          created_at: '',
          status: 0
        }

        if (typeof response.data === 'string') {
          const splitIndex = response.data.indexOf('}{') + 1
          const secondPart = response.data.substring(splitIndex)
          taskData = JSON.parse(secondPart)
        } else if (typeof response.data === 'object') {
          taskData = response.data
        }
        const index = this.tasks.findIndex((t) => t.id === taskId)
        if (index !== -1) {
          taskData.status = Number(taskData.status)
          this.tasks[index] = taskData
        }
      } catch (error) {
        console.error('Error changing task status:', error)
        throw error
      }
    }
  }
})
