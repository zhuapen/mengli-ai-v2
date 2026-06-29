/**
 * 插件中心模块类型定义
 * 所有 plugin 相关类型统一在此定义
 */
import type { PaginationParams, PaginationResult } from '@/core/api/types'

/** 插件状态 */
export type PluginStatus = 'enabled' | 'disabled'

/** 插件分类 */
export interface PluginCategory {
  id: string
  name: string
  icon?: string
}

/** 插件项（当前 UI 使用） */
export interface PluginItem {
  id: string
  name: string
  description: string
  icon: string
  version: string
  downloads: number
  category: string
}

/** 插件查询参数 */
export interface PluginQueryParams extends PaginationParams {
  keyword?: string
  categoryId?: string
  status?: PluginStatus | 'all'
}

/** 插件列表结果 */
export type PluginListResult = PaginationResult<PluginItem>
