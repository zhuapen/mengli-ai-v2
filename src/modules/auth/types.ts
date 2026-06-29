/**
 * Auth 模块类型定义
 * 所有 Auth 相关类型统一在此定义
 */

/** 登录请求参数 */
export interface LoginParams {
  account: string
  password: string
}

/** 注册请求参数 */
export interface RegisterParams {
  username: string
  account: string
  password: string
}

/** 认证用户信息 */
export interface AuthUser {
  id: string
  username: string
  avatar?: string
  role: string
}

/** 认证 Token */
export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

/** 登录结果 */
export interface LoginResult {
  user: AuthUser
  tokens: AuthTokens
}

/** 注册结果 */
export interface RegisterResult {
  user: AuthUser
  tokens: AuthTokens
}
