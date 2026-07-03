/**
 * Auth 模块类型定义
 * 对齐后端真实接口
 */

/** 登录请求参数 */
export interface LoginParams {
  email: string
  password: string
}

/** 注册请求参数 */
export interface RegisterParams {
  email: string
  password: string
}

/** 后端返回的用户结构 */
export interface BackendUser {
  id: string
  email: string
  display_name?: string
  role: string
  status?: string
  position?: string
  is_active?: boolean
}

/** 前端统一用户结构（经 service 转换） */
export interface AuthUser {
  id: string
  email: string
  username: string
  avatar?: string
  role: string
  status?: string
}

/** 认证 Token */
export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

/** 后端登录响应（直接返回，无 ApiResponse 包裹） */
export interface BackendLoginResponse {
  token: string
  user: BackendUser
}

/** 后端注册响应（直接返回，无 ApiResponse 包裹） */
export interface BackendRegisterResponse {
  user: BackendUser
  message: string
}

/** 登录结果（前端使用，经 service 转换） */
export interface LoginResult {
  user: AuthUser
  tokens: AuthTokens
}

/** 注册结果（前端使用） */
export interface RegisterResult {
  user: AuthUser
  message: string
}
