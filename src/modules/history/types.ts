/**
 * 历史记录模块类型定义
 * 所有 history 相关类型统一在此定义
 */
import type { PaginationParams, PaginationResult } from '@/core/api/types'

/** 历史记录类型 */
export type HistoryType = 'copy' | 'image' | 'article'

/** 历史记录项 */
export interface HistoryItem {
  id: string
  type: HistoryType
  title: string
  content: string
  createdAt: string
}

/** 历史查询参数 */
export interface HistoryQueryParams extends PaginationParams {
  keyword?: string
  type?: HistoryType | 'all'
}

/** 历史列表结果 */
export type HistoryListResult = PaginationResult<HistoryItem>

/** Tab 类型 */
export type HistoryTabType = 'all' | HistoryType
