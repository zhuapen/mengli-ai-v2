import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false)
  const sidebarCollapsed = ref(false)
  const theme = ref<'light'>('light')

  // Actions
  function setLoading(status: boolean) {
    loading.value = status
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    loading,
    sidebarCollapsed,
    theme,
    setLoading,
    toggleSidebar,
  }
})
