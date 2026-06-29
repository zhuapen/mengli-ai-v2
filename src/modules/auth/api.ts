/**
 * Auth 真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { LoginParams, LoginResult, RegisterParams, RegisterResult, AuthUser } from './types'

export const authApi = {
  /** 登录 */
  login(params: LoginParams): Promise<LoginResult> {
    return api.post<LoginResult>('/auth/login', params)
  },

  /** 注册 */
  register(params: RegisterParams): Promise<RegisterResult> {
    return api.post<RegisterResult>('/auth/register', params)
  },

  /** 登出 */
  logout(): Promise<void> {
    return api.post<void>('/auth/logout')
  },

  /** 获取当前用户信息 */
  getCurrentUser(): Promise<AuthUser> {
    return api.get<AuthUser>('/auth/me')
  },
}
