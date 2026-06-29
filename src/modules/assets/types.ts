/**
 * 素材库模块类型定义
 * 所有 assets 相关类型统一在此定义
 */
import type { PaginationParams, PaginationResult } from '@/core/api/types'

/** 素材类型 */
export type AssetType = 'image' | 'copy' | 'article' | 'feedback'

/** 素材项 */
export interface AssetItem {
  id: string
  title: string
  type: AssetType
  content: string
  createdAt: string
}

/** 素材查询参数 */
export interface AssetQueryParams extends PaginationParams {
  keyword?: string
  type?: AssetType | 'all'
}

/** 创建素材参数 */
export interface CreateAssetParams {
  title: string
  type: AssetType
  content: string
}

/** 素材列表结果 */
export type AssetListResult = PaginationResult<AssetItem>
