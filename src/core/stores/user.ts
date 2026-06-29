/**
 * 用户 Store
 * 统一管理用户状态、认证、token
 * 只调用 authService，不直接 axios / mock
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/modules/auth/service'
import { getAccessToken } from '@/core/auth/token'
import { logger } from '@/core/logger'
import type { AuthUser, LoginParams, RegisterParams } from '@/modules/auth/types'

export const useUserStore = defineStore('user', () => {
  // ===== State =====
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ===== Getters =====
  const isLoggedIn = computed(() => !!user.value && !!getAccessToken())
  const username = computed(() => user.value?.username || '')
  const role = computed(() => user.value?.role || 'guest')
  const avatar = computed(() => user.value?.avatar || '👤')

  // ===== Actions =====

  /** 登录 */
  async function login(params: LoginParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await authService.login(params)
      user.value = result.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登录失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** 注册 */
  async function register(params: RegisterParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await authService.register(params)
      user.value = result.user
    } catch (e) {
      error.value = e instanceof Error ? e.message : '注册失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /** 登出 */
  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authService.logout()
    } catch {
      logger.warn('[UserStore] logout API failed')
    } finally {
      user.value = null
      error.value = null
      loading.value = false
    }
  }

  /** 获取当前用户信息 */
  async function fetchCurrentUser(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      user.value = await authService.getCurrentUser()
    } catch (e) {
      user.value = null
      error.value = e instanceof Error ? e.message : '获取用户信息失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * 恢复登录态
   * 页面刷新时调用：如果有 token，尝试获取用户信息
   */
  async function restoreSession(): Promise<void> {
    if (!authService.hasToken()) {
      user.value = null
      return
    }

    loading.value = true
    try {
      user.value = await authService.getCurrentUser()
      logger.info('[UserStore] session restored', { userId: user.value.id })
    } catch {
      user.value = null
      logger.warn('[UserStore] session restore failed, cleared user')
    } finally {
      loading.value = false
    }
  }

  /** 清除用户状态 */
  function clearUser(): void {
    user.value = null
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isLoggedIn,
    username,
    role,
    avatar,
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    restoreSession,
    clearUser,
  }
})
