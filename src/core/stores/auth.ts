/**
 * Auth Store（兼容层）
 * 仅保留 isAuthenticated 用于路由守卫等场景
 * 业务逻辑已迁移到 useUserStore + authService
 * @deprecated 优先使用 useUserStore
 */
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getAccessToken } from '@/core/auth/token'

export const useAuthStore = defineStore('auth', () => {
  /** 是否已认证（仅检查本地 token） */
  const isAuthenticated = computed(() => !!getAccessToken())

  return {
    isAuthenticated,
  }
})
