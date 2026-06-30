/**
 * API 统一入口
 * 所有模块通过此文件发起 HTTP 请求
 *
 * 注意：http 拦截器已处理 ApiResponse 解包
 * - ApiResponse 包裹响应：拦截器解包后 response.data = data
 * - 原始业务响应：拦截器直接透传 response.data = 原始数据
 * 所以 api helper 统一返回 res.data 即可
 */
import type { AxiosRequestConfig } from 'axios'
import http from './http'

// Re-export types
export type { ApiResponse, ApiError, PaginationParams, PaginationResult } from './types'

// Re-export error codes
export { ApiErrorCode, API_ERROR_MESSAGES, getErrorMessage } from './error-code'

/** 封装请求方法 */
export const api = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.get<T>(url, config).then((res) => res.data)
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return http.post<T>(url, data, config).then((res) => res.data)
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return http.put<T>(url, data, config).then((res) => res.data)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.delete<T>(url, config).then((res) => res.data)
  },

  upload<T>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return http
      .post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })
      .then((res) => res.data)
  },
}

export default api
