/**
 * Auth Service
 * 业务编排 + Mock/API 自动切换
 * 负责：token 管理、用户数据转换、日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { setTokens, clearTokens, getAccessToken } from '@/core/auth/token'
import { authApi } from './api'
import { authMockApi } from './mock'
import type {
  LoginParams,
  LoginResult,
  RegisterParams,
  RegisterResult,
  AuthUser,
  BackendUser,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 后端用户转换为前端用户 */
function normalizeUser(user: BackendUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    username: user.display_name || user.email.split('@')[0],
    role: user.role,
    status: user.status,
    avatar: undefined,
  }
}

export const authService = {
  /**
   * 登录
   * 成功后写入 token，返回转换后的用户信息
   */
  async login(params: LoginParams): Promise<LoginResult> {
    logger.info('[AuthService] login', { email: params.email })

    const res = useMock()
      ? await authMockApi.login(params)
      : { code: 0, message: 'success', success: true, data: await authApi.login(params) }

    if (!res.success || res.code !== 0) {
      throw new Error(res.message || '登录失败')
    }

    // 写入 token
    setTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken)
    logger.info('[AuthService] login success', { userId: res.data.user.id })

    // 转换用户结构
    return {
      user: normalizeUser(res.data.user),
      tokens: res.data.tokens,
    }
  },

  /**
   * 注册
   * 后端注册不返回 tokens，不写入 token
   */
  async register(params: RegisterParams): Promise<RegisterResult> {
    logger.info('[AuthService] register', { email: params.email })

    const res = useMock()
      ? await authMockApi.register(params)
      : { code: 0, message: 'success', success: true, data: await authApi.register(params) }

    if (!res.success || res.code !== 0) {
      throw new Error(res.message || '注册失败')
    }

    logger.info('[AuthService] register success')

    // 注册不写入 token，需要管理员审批
    return {
      user: normalizeUser(res.data.user),
      message: res.data.message,
    }
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
      return normalizeUser(res.data)
    }

    const user = await authApi.getCurrentUser()
    return normalizeUser(user)
  },

  /**
   * 检查是否有 token（不验证有效性）
   */
  hasToken(): boolean {
    return !!getAccessToken()
  },
}
