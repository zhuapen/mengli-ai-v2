/**
 * Auth Service
 * 业务编排 + Mock/API 自动切换
 * 负责：token 管理、日志、事件通知
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { setTokens, clearTokens, getAccessToken } from '@/core/auth/token'
import { authApi } from './api'
import { authMockApi } from './mock'
import type { LoginParams, LoginResult, RegisterParams, RegisterResult, AuthUser } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const authService = {
  /**
   * 登录
   * 成功后写入 token
   */
  async login(params: LoginParams): Promise<LoginResult> {
    logger.info('[AuthService] login', { account: params.account })

    const res = useMock()
      ? await authMockApi.login(params)
      : { code: 0, message: 'success', success: true, data: await authApi.login(params) }

    if (!res.success || res.code !== 0) {
      throw new Error(res.message || '登录失败')
    }

    // 写入 token
    setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken)
    logger.info('[AuthService] login success', { userId: res.data.user.id })

    return res.data
  },

  /**
   * 注册
   * 成功后写入 token
   */
  async register(params: RegisterParams): Promise<RegisterResult> {
    logger.info('[AuthService] register', { username: params.username })

    const res = useMock()
      ? await authMockApi.register(params)
      : { code: 0, message: 'success', success: true, data: await authApi.register(params) }

    if (!res.success || res.code !== 0) {
      throw new Error(res.message || '注册失败')
    }

    // 写入 token
    setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken)
    logger.info('[AuthService] register success', { userId: res.data.user.id })

    return res.data
  },

  /**
   * 登出
   * 清理 token
   */
  async logout(): Promise<void> {
    logger.info('[AuthService] logout')

    try {
      if (useMock()) {
        await authMockApi.logout()
      } else {
        await authApi.logout()
      }
    } catch {
      // 登出接口失败不影响本地清理
      logger.warn('[AuthService] logout API failed, clearing local tokens anyway')
    }

    clearTokens()
    logger.info('[AuthService] logout success')
  },

  /**
   * 获取当前用户信息
   * 失败时清理 token
   */
  async getCurrentUser(): Promise<AuthUser> {
    logger.info('[AuthService] getCurrentUser')

    if (useMock()) {
      const res = await authMockApi.getCurrentUser()
      if (!res.success || res.code !== 0) {
        clearTokens()
        throw new Error(res.message || '获取用户信息失败')
      }
      return res.data
    }

    const user = await authApi.getCurrentUser()
    return user
  },

  /**
   * 检查是否有 token（不验证有效性）
   */
  hasToken(): boolean {
    return !!getAccessToken()
  },
}
