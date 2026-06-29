/**
 * Auth Mock API
 * 返回结构必须与真实 api 完全一致
 */
import type { ApiResponse } from '@/core/api/types'
import type { LoginParams, LoginResult, RegisterParams, RegisterResult, AuthUser } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockAdmin: AuthUser = {
  id: '1',
  username: '管理员',
  avatar: '👑',
  role: 'admin',
}

const mockUser: AuthUser = {
  id: '2',
  username: '萌力用户',
  avatar: '👤',
  role: 'user',
}

/** 当前已登录的 mock 用户（模块级状态） */
let currentUser: AuthUser | null = null

export const authMockApi = {
  async login(params: LoginParams): Promise<ApiResponse<LoginResult>> {
    await delay(800)

    if (params.account === 'admin' && params.password === '123456') {
      currentUser = mockAdmin
      return {
        code: 0,
        message: 'success',
        success: true,
        data: {
          user: mockAdmin,
          tokens: {
            accessToken: 'mock-access-' + Date.now(),
            refreshToken: 'mock-refresh-' + Date.now(),
          },
        },
      }
    }

    if (params.account && params.password) {
      currentUser = mockUser
      return {
        code: 0,
        message: 'success',
        success: true,
        data: {
          user: mockUser,
          tokens: {
            accessToken: 'mock-access-' + Date.now(),
            refreshToken: 'mock-refresh-' + Date.now(),
          },
        },
      }
    }

    return {
      code: 401,
      message: '用户名或密码错误',
      success: false,
      data: undefined as unknown as LoginResult,
    }
  },

  async register(_params: RegisterParams): Promise<ApiResponse<RegisterResult>> {
    await delay(1000)
    currentUser = mockUser
    return {
      code: 0,
      message: 'success',
      success: true,
      data: {
        user: mockUser,
        tokens: {
          accessToken: 'mock-access-' + Date.now(),
          refreshToken: 'mock-refresh-' + Date.now(),
        },
      },
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(300)
    currentUser = null
    return { code: 0, message: 'success', success: true, data: undefined }
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    await delay(500)
    // 返回当前已登录用户；如无记录则返回默认用户（避免 restoreSession 失败）
    return { code: 0, message: 'success', success: true, data: currentUser ?? mockUser }
  },
}
