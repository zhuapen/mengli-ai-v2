/**
 * Auth Mock API
 * 返回结构必须与真实 api 完全一致
 */
import type { ApiResponse } from '@/core/api/types'
import type {
  LoginParams,
  LoginResponse,
  RegisterParams,
  RegisterResponse,
  BackendUser,
} from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockAdmin: BackendUser = {
  id: '1',
  email: 'admin@mengli.ai',
  display_name: '管理员',
  role: 'admin',
  status: 'active',
}

const mockUser: BackendUser = {
  id: '2',
  email: 'user@mengli.ai',
  display_name: '萌力用户',
  role: 'user',
  status: 'active',
}

/** 当前已登录的 mock 用户（模块级状态） */
let currentUser: BackendUser | null = null

export const authMockApi = {
  async login(params: LoginParams): Promise<ApiResponse<LoginResponse>> {
    await delay(800)

    if (params.email === 'admin@mengli.ai' && params.password === '123456') {
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

    if (params.email && params.password) {
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
      message: '邮箱或密码错误',
      success: false,
      data: undefined as unknown as LoginResponse,
    }
  },

  async register(_params: RegisterParams): Promise<ApiResponse<RegisterResponse>> {
    await delay(1000)
    // 注册不返回 tokens，需要管理员审批
    return {
      code: 0,
      message: 'success',
      success: true,
      data: {
        user: mockUser,
        message: '注册成功，等待管理员审批',
      },
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    await delay(300)
    currentUser = null
    return { code: 0, message: 'success', success: true, data: undefined }
  },

  async getCurrentUser(): Promise<ApiResponse<BackendUser>> {
    await delay(500)
    // 返回当前已登录用户；如无记录则返回默认用户
    return { code: 0, message: 'success', success: true, data: currentUser ?? mockUser }
  },
}
