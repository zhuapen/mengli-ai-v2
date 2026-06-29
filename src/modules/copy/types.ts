/**
 * 小红书文案模块类型定义
 * 所有 copy 相关类型统一在此定义
 */

/** 文案类型选项 */
export interface CopyTypeOption {
  value: string
  label: string
}

/** 品牌选项 */
export interface BrandOption {
  value: string
  label: string
}

/** 文案模板 */
export interface CopyTemplate {
  id: string
  name: string
  prompt: string
  category: string
}

/** 生成请求参数 */
export interface CopyGenerateParams {
  copyType: string
  brand: string
  product: string
  extra?: string
}

/** 优化请求参数 */
export interface CopyRefineParams {
  content: string
  instruction: string
}

/** 生成/优化结果 */
export interface CopyGenerateResult {
  content: string
  version: number
}

/** 历史记录项 */
export interface CopyHistoryItem {
  id: string
  copyType: string
  product: string
  content: string
  createdAt: string
}
