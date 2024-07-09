<template>
  <div class="container mt-5">
    <div class="row">
      <div v-for="(column, index) in columns" :key="index" class="col-md-3">
        <div class="header">
          <h3>{{ column.title }}</h3>
        </div>
        <div class="list-group">
          <div
            v-for="task in filteredTasks(column.status)"
            :key="task.id"
            class="list-group-item task-item"
          >
            <div>
              <h5 class="mb-1">{{ task.title }}</h5>
              <p class="mb-1">{{ task.description }}</p>
              <small>{{ formatDate(task.created_at) }}</small>
            </div>
            <div class="d-flex mt-2">
              <button
                class="btn btn-sm btn-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#changeTaskModal"
                @click="setTask(task)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#deleteTaskModal"
                @click="currentTask = task"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="changeTaskModal"
    tabindex="-1"
    aria-labelledby="changeTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="changeTaskModalLabel">Change task</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="changeTask">
            <div class="form-group">
              <label for="title">Title:</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="currentTask.title"
                required
              />
            </div>
            <div class="form-group">
              <label for="description">Description:</label>
              <textarea
                class="form-control"
                id="description"
                v-model="currentTask.description"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="editStatus">Status:</label>
              <select class="form-control" id="editStatus" v-model="currentTask.status" required>
                <option v-for="status in statusOptions" :key="status.status" :value="status.status">
                  {{ status.title }}
                </option>
              </select>
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

  <div
    class="modal fade"
    id="deleteTaskModal"
    tabindex="-1"
    aria-labelledby="deleteTaskModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteTaskModalLabel">Delete task</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this task?</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-danger" @click="deleteTask">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type PropType, ref } from 'vue'
import { type Task, type StatusOption } from '../types/index'
import { useTaskStore } from '../stores/taskStore'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'TaskBoard',
  props: {
    tasks: {
      type: Array as PropType<Task[]>,
      default: () => []
    }
  },
  setup(props) {
    const currentTask = ref<Task>({
      id: 0,
      title: '',
      description: '',
      created_at: '',
      status: 0,
      updated_at: '',
      user_id: 0
    })

    const firstVersionOfTask = ref<Task>({ ...currentTask.value })

    const setTask = (task: Task) => {
      currentTask.value = { ...task }
      firstVersionOfTask.value = { ...task }
    }

    const columns = [
      { title: 'Opened', status: 0 },
      { title: 'In Progress', status: 1 },
      { title: 'Done', status: 2 },
      { title: 'Closed', status: 3 }
    ]

    const filteredTasks = (status: number) => {
      return props.tasks.filter((task) => task.status === status)
    }

    const statusOptions = computed(() => {
      let options: StatusOption[] = []
      const status = currentTask.value.status
      if (status === 0) options = columns.filter((el) => el.status !== 2)
      else if (status === 1) options = columns
      else if (status === 2) options = columns.filter((el) => el.status === 2 || el.status === 3)
      else options = options = columns.filter((el) => el.status === 0 || el.status === 3)
      return options
    })

    const formatDate = (createdDate: string) => {
      const date = new Date(createdDate)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const closeModal = (id: string) => {
      const modalElement = document.getElementById(id)
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement)
        modalInstance.hide()
      }
    }

    const taskStore = useTaskStore()
    const changeTask = async () => {
      if (
        firstVersionOfTask.value.title !== currentTask.value.title ||
        firstVersionOfTask.value.description !== currentTask.value.description
      ) {
        try {
          taskStore.updateTask(currentTask.value)
        } catch (error) {
          console.log(error)
        }
      }
      if (firstVersionOfTask.value.status !== currentTask.value.status) {
        try {
          taskStore.changeTaskStatus(Number(currentTask.value.id), String(currentTask.value.status))
        } catch (error) {
          console.log(error)
        }
      }
      closeModal('changeTaskModal')
    }

    const deleteTask = async () => {
      try {
        taskStore.deleteTask(Number(currentTask.value.id))
      } catch (error) {
        console.log(error)
      }
      closeModal('deleteTaskModal')
    }
    return {
      formatDate,
      setTask,
      currentTask,
      changeTask,
      deleteTask,
      statusOptions,
      filteredTasks,
      columns
    }
  }
})
</script>

<style scoped>
.header {
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.task-item {
  margin-bottom: 15px;
}
</style>
