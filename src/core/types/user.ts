/**
 * 用户角色
 */
export type UserRole = 'guest' | 'user' | 'vip' | 'operator' | 'admin' | 'superadmin'

/**
 * 用户信息
 */
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: UserRole
  permissions: string[]
  createdAt: string
  updatedAt: string
}

/**
 * 登录请求
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
}
