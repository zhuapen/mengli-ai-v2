/**
 * Auth Mock API
 * 模拟真实后端响应格式（无 ApiResponse 包裹）
 */
import type {
  LoginParams,
  BackendLoginResponse,
  RegisterParams,
  BackendRegisterResponse,
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
  status: 'approved',
  is_active: true,
}

const mockUser: BackendUser = {
  id: '2',
  email: 'user@mengli.ai',
  display_name: '萌力用户',
  role: 'user',
  status: 'approved',
  is_active: true,
}

/** 当前已登录的 mock 用户（模块级状态） */
let currentUser: BackendUser | null = null

export const authMockApi = {
  /**
   * 登录
   * 模拟后端返回 { token, user }，无 ApiResponse 包裹
   */
  async login(params: LoginParams): Promise<BackendLoginResponse> {
    await delay(800)

    if (params.email === 'admin@mengli.ai' && params.password === '123456') {
      currentUser = mockAdmin
      return {
        token: 'mock-token-' + Date.now(),
        user: mockAdmin,
      }
    }

    if (params.email && params.password) {
      currentUser = mockUser
      return {
        token: 'mock-token-' + Date.now(),
        user: mockUser,
      }
    }

    throw new Error('邮箱或密码错误')
  },

  /**
   * 注册
   * 模拟后端返回 { user, message }，无 tokens
   */
  async register(_params: RegisterParams): Promise<BackendRegisterResponse> {
    await delay(1000)
    return {
      user: mockUser,
      message: '注册成功，等待管理员审批',
    }
  },

  /** 登出 */
  async logout(): Promise<void> {
    await delay(300)
    currentUser = null
  },

  /** 获取当前用户 */
  async getCurrentUser(): Promise<BackendUser> {
    await delay(500)
    return currentUser ?? mockUser
  },
}
