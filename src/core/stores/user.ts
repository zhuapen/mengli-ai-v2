import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/core/api'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
  permissions: string[]
}

export const useUserStore = defineStore('user', () => {
  // State
  const profile = ref<User | null>(null)
  const loading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!profile.value)
  const username = computed(() => profile.value?.username || '')
  const role = computed(() => profile.value?.role || 'guest')
  const permissions = computed(() => profile.value?.permissions || [])

  // Actions
  async function fetchUser() {
    loading.value = true
    try {
      profile.value = await api.get<User>('/user/profile')
    } finally {
      loading.value = false
    }
  }

  function hasPermission(permission: string): boolean {
    return permissions.value.includes(permission) || permissions.value.includes('*')
  }

  function hasRole(targetRole: string): boolean {
    return role.value === targetRole || role.value === 'superadmin'
  }

  function clearUser() {
    profile.value = null
  }

  return {
    profile,
    loading,
    isLoggedIn,
    username,
    role,
    permissions,
    fetchUser,
    hasPermission,
    hasRole,
    clearUser,
  }
})
