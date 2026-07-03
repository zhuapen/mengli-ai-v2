/**
 * Auth 真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type {
  LoginParams,
  BackendLoginResponse,
  RegisterParams,
  BackendRegisterResponse,
  BackendUser,
} from './types'

export const authApi = {
  /** 登录 */
  login(params: LoginParams): Promise<BackendLoginResponse> {
    return api.post<BackendLoginResponse>('/auth/login', params)
  },

  /** 注册 */
  register(params: RegisterParams): Promise<BackendRegisterResponse> {
    return api.post<BackendRegisterResponse>('/auth/register', params)
  },

  /** 登出 */
  logout(): Promise<void> {
    return api.post<void>('/auth/logout')
  },

  /** 获取当前用户信息 */
  getCurrentUser(): Promise<BackendUser> {
    return api.get<BackendUser>('/auth/me')
  },
}
