import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import HeaderComponent from '../Header.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../../stores/authStore'
import { useTaskStore } from '../../stores/taskStore'

describe('HeaderComponent', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let taskStore: ReturnType<typeof useTaskStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    taskStore = useTaskStore()
  })

  it('renders the component', () => {
    const wrapper = mount(HeaderComponent)

    expect(wrapper.text()).toContain('Welcome!')
    expect(wrapper.find('button[data-bs-target="#createTaskModal"]').exists()).toBe(true)
    expect(wrapper.find('button.btn-primary').text()).toBe('Logout')
  })
})
