/**
 * Axios 实例统一治理
 * 所有 HTTP 请求必须通过此实例，禁止业务模块自行创建
 *
 * 兼容两种后端响应格式：
 *   A) ApiResponse 包裹：{ code, message, data, success }
 *   B) 原始业务响应：{ token, user } 等直接返回
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

/**
 * 判断响应体是否为 ApiResponse 包裹格式
 * 条件：有 success 布尔字段 AND 有 code 数字字段
 */
function isApiResponseEnvelope(body: unknown): body is ApiResponse<unknown> {
  if (typeof body !== 'object' || body === null) return false
  const obj = body as Record<string, unknown>
  return typeof obj.success === 'boolean' && typeof obj.code === 'number'
}

/** 响应拦截器：统一处理 ApiResponse / 原始响应 / 401 / 网络错误 */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response.data

    // 情况 A：响应体是 ApiResponse 包裹格式
    if (isApiResponseEnvelope(body)) {
      // 业务失败
      if (!body.success || (body.code !== 0 && body.code !== 200)) {
        const apiError: ApiError = {
          code: body.code,
          message: (body as ApiResponse<unknown>).message || getErrorMessage(body.code),
          detail: (body as ApiResponse<unknown>).data as string | undefined,
        }
        logger.error('[HTTP] Business error', apiError)
        return Promise.reject(apiError)
      }
      // 业务成功：解包，把 data 放到 response.data
      response.data = (body as ApiResponse<unknown>).data
      return response
    }

    // 情况 B：原始业务响应（非 ApiResponse 包裹），直接透传
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
      message: error.response?.data?.message ?? error.response?.data?.detail ?? getErrorMessage(errorCode),
      detail: error.response?.data?.detail,
    }

    logger.error('[HTTP] Response error', apiError)
    return Promise.reject(apiError)
  },
)

export { http }
export default http
