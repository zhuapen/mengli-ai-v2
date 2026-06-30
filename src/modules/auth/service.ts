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
   * 后端返回 { token, user }，转换为前端 { user, tokens }
   * 成功后写入 token
   */
  async login(params: LoginParams): Promise<LoginResult> {
    logger.info('[AuthService] login', { email: params.email })

    const res = useMock()
      ? await authMockApi.login(params)
      : await authApi.login(params)

    // 后端返回 { token, user }
    // 保存 token
    setTokens(res.token)
    logger.info('[AuthService] login success', { userId: res.user.id })

    // 转换为前端格式
    return {
      user: normalizeUser(res.user),
      tokens: { accessToken: res.token },
    }
  },

  /**
   * 注册
   * 后端返回 { user, message }，无 tokens
   * 注册后不写入 token，需要管理员审批
   */
  async register(params: RegisterParams): Promise<RegisterResult> {
    logger.info('[AuthService] register', { email: params.email })

    const res = useMock()
      ? await authMockApi.register(params)
      : await authApi.register(params)

    logger.info('[AuthService] register success')

    return {
      user: normalizeUser(res.user),
      message: res.message,
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

    try {
      const user = useMock()
        ? await authMockApi.getCurrentUser()
        : await authApi.getCurrentUser()

      return normalizeUser(user)
    } catch (e) {
      clearTokens()
      const msg = e instanceof Error ? e.message : '获取用户信息失败'
      logger.error('[AuthService] getCurrentUser failed', msg)
      throw new Error(msg)
    }
  },

  /**
   * 检查是否有 token（不验证有效性）
   */
  hasToken(): boolean {
    return !!getAccessToken()
  },
}
