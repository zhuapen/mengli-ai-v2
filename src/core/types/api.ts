/**
 * @deprecated 请从 @/core/api/types 导入
 * 此文件保留用于兼容，新代码请使用 @/core/api/types
 */
export type { ApiResponse, ApiError, PaginationParams, PaginationResult } from '@/core/api/types'

/** @deprecated 请使用 PaginationResult */
export type { PaginationResult as PaginatedData } from '@/core/api/types'

/** 排序参数 */
export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

/** 搜索参数 */
export interface SearchParams {
  keyword?: string
}
