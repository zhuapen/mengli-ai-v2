/**
 * API 统一类型定义
 * 所有模块必须使用这些类型，禁止自行定义
 */

/** 统一 API 响应格式 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  success: boolean
}

/** API 错误格式 */
export interface ApiError {
  code: number
  message: string
  detail?: string
}

/** 分页请求参数 */
export interface PaginationParams {
  page: number
  pageSize: number
}

/** 分页响应结果 */
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
