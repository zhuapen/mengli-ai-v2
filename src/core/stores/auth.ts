import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/core/api'
import { cache } from '@/core/cache'
import { logger } from '@/core/logger'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(cache.getLocal('token'))
  const refreshTokenValue = ref<string | null>(cache.getLocal('refreshToken'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  async function login(username: string, password: string) {
    loading.value = true
    try {
      const result = await api.post<{ token: string; refreshToken: string }>('/auth/login', {
        username,
        password,
      })

      token.value = result.token
      refreshTokenValue.value = result.refreshToken

      cache.setLocal('token', result.token)
      cache.setLocal('refreshToken', result.refreshToken)

      logger.info('Login successful')
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    token.value = null
    refreshTokenValue.value = null
    cache.removeLocal('token')
    cache.removeLocal('refreshToken')
    logger.info('Logout successful')
  }

  // Mock 登录（开发阶段使用）
  function setMockToken(mockToken: string) {
    token.value = mockToken
    cache.setLocal('token', mockToken)
    logger.info('Mock login successful')
  }

  async function refreshUserToken(): Promise<boolean> {
    if (!refreshTokenValue.value) return false

    try {
      const result = await api.post<{ token: string; refreshToken: string }>('/auth/refresh', {
        refreshToken: refreshTokenValue.value,
      })

      token.value = result.token
      refreshTokenValue.value = result.refreshToken

      cache.setLocal('token', result.token)
      cache.setLocal('refreshToken', result.refreshToken)

      return true
    } catch {
      logout()
      return false
    }
  }

  return {
    token,
    refreshToken: refreshTokenValue,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshUserToken,
    setMockToken,
  }
})
