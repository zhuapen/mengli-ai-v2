/**
 * 公众号写稿模块类型定义
 * 所有 article 相关类型统一在此定义
 */
import type { PaginationParams, PaginationResult } from '@/core/api/types'

/** 文章模板 */
export interface ArticleTemplate {
  id: string
  name: string
  description: string
}

/** 生成请求参数 */
export interface ArticleGenerateParams {
  title: string
  mode: 'outline' | 'draft'
  requirements?: string
  file?: { name: string; size: string }
}

/** 生成结果 */
export interface ArticleGenerateResult {
  content: string
  mode: 'outline' | 'draft'
}

/** 草稿 */
export interface ArticleDraft {
  id: string
  title: string
  content: string
  updatedAt: string
}

/** 历史记录项 */
export interface ArticleHistoryItem {
  id: string
  title: string
  mode: 'outline' | 'draft'
  content: string
  createdAt: string
}

/** 历史查询参数 */
export interface ArticleHistoryQueryParams extends PaginationParams {
  keyword?: string
}

/** 历史列表结果 */
export type ArticleHistoryResult = PaginationResult<ArticleHistoryItem>
