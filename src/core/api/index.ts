/**
 * API 统一入口
 * 所有模块通过此文件发起 HTTP 请求
 */
import type { AxiosRequestConfig } from 'axios'
import http from './http'
import type { ApiResponse } from './types'

// Re-export types
export type { ApiResponse, ApiError, PaginationParams, PaginationResult } from './types'

// Re-export error codes
export { ApiErrorCode, API_ERROR_MESSAGES, getErrorMessage } from './error-code'

/** 封装请求方法，统一解包 ApiResponse */
export const api = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.get<ApiResponse<T>>(url, config).then((res) => res.data.data)
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return http.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data)
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return http.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return http.delete<ApiResponse<T>>(url, config).then((res) => res.data.data)
  },

  upload<T>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return http
      .post<ApiResponse<T>>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })
      .then((res) => res.data.data)
  },
}

export default api
