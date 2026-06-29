/**
 * Axios 实例统一治理
 * 所有 HTTP 请求必须通过此实例，禁止业务模块自行创建
 */
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { logger } from '@/core/logger'
import { getAccessToken, clearTokens } from '@/core/auth/token'
import type { ApiResponse, ApiError } from './types'
import { ApiErrorCode, getErrorMessage } from './error-code'

/** 创建 Axios 实例 */
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** 请求拦截器：自动带 token */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    logger.error('[HTTP] Request interceptor error', error)
    return Promise.reject(error)
  },
)

/** 判断业务是否成功 */
function isSuccessResponse(res: ApiResponse<unknown>): boolean {
  return res.success === true && (res.code === 0 || res.code === 200)
}

/** 响应拦截器：统一处理 ApiResponse / 401 / 业务错误 / 网络错误 */
http.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data

    // HTTP 200 但业务失败
    if (!isSuccessResponse(body)) {
      const apiError: ApiError = {
        code: body.code,
        message: body.message || getErrorMessage(body.code),
        detail: body.data as string | undefined,
      }
      logger.error('[HTTP] Business error', apiError)
      return Promise.reject(apiError)
    }

    return response
  },
  async (error) => {
    const status = error.response?.status

    // 401：清理用户态，跳转登录
    if (status === 401) {
      logger.warn('[HTTP] 401 Unauthorized, clearing auth state')
      clearTokens()

      // 避免在登录页重复跳转
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // 统一转换为 ApiError
    const errorCode = status ?? (error.code === 'ERR_NETWORK' ? ApiErrorCode.NetworkError : ApiErrorCode.UnknownError)
    const apiError: ApiError = {
      code: errorCode,
      message: error.response?.data?.message ?? getErrorMessage(errorCode),
      detail: error.response?.data?.detail,
    }

    logger.error('[HTTP] Response error', apiError)
    return Promise.reject(apiError)
  },
)

export { http }
export default http
