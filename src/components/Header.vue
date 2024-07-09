<template>
  <header class="d-flex justify-content-between align-items-center p-3 border-bottom">
    <span class="h1 mb-0">Welcome! </span>
    <div>
      <button
        class="btn btn-light btn-lg me-3"
        data-bs-toggle="modal"
        data-bs-target="#createTaskModal"
      >
        Create new task
      </button>
      <button class="btn btn-primary btn-lg" @click="logout">Logout</button>
    </div>
  </header>

  <div
    class="modal fade"
    id="createTaskModal"
    tabindex="-1"
    aria-labelledby="createTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createTaskModalLabel">Create task</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addTask">
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" class="form-control" id="title" v-model="newTask.title" required />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea
                class="form-control"
                id="description"
                v-model="newTask.description"
                required
              ></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const store = useAuthStore()
    const taskStore = useTaskStore()
    const newTask = ref({
      title: '',
      description: '',
      created_at: '',
      status: 0
    })

    const logout = async () => {
      await store.logout()
    }
    const addTask = async () => {
      newTask.value.created_at = new Date().toISOString().split('T')[0]
      try {
        taskStore.createTask(newTask.value)
        newTask.value.title = ''
        newTask.value.description = ''
        newTask.value.status = 0
        const modalElement = document.getElementById('createTaskModal')
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)
          modalInstance.hide()
        }
      } catch (error) {
        console.log(error)
      }
    }

    return {
      logout,
      addTask,
      newTask
    }
  }
})
</script>
