<template>
  <div>
    <HeaderComponent />
    <TaskBoard :tasks="tasks" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import HeaderComponent from '../components/Header.vue'
import TaskBoard from '../components/TaskBoard.vue'
import { useAuthStore } from '../stores/authStore'
import { useTaskStore } from '../stores/taskStore'

export default defineComponent({
  name: 'HomeView',
  components: {
    HeaderComponent,
    TaskBoard
  },
  setup() {
    const authStore = useAuthStore()
    const taskStore = useTaskStore()

    const tasks = ref()

    watch(
      () => taskStore.tasks,
      (newValue) => {
        tasks.value = newValue
      }
    )
    onMounted(() => {
      const token = localStorage.getItem('token')
      if (token !== null && token !== undefined) {
        authStore.token = localStorage.getItem('token') || ''
        authStore.authenticated = true
        taskStore.fetchTasks()
      }
    })

    return {
      tasks
    }
  }
})
</script>
