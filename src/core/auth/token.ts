/**
 * Token 统一管理
 * 所有 token 读写必须通过此模块，禁止直接操作 localStorage
 */

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/** 获取 access token */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** 设置 access token */
export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 移除 access token */
export function removeAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** 获取 refresh token */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/** 设置 refresh token */
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

/** 移除 refresh token */
export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/** 清除所有 token */
export function clearTokens(): void {
  removeAccessToken()
  removeRefreshToken()
}

/** 设置双 token */
export function setTokens(accessToken: string, refreshToken?: string): void {
  setAccessToken(accessToken)
  if (refreshToken) {
    setRefreshToken(refreshToken)
  }
}
