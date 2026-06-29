/**
 * AI 图片模块类型定义
 * 所有 image 相关类型统一在此定义
 */

/** 图片风格 */
export type ImageStyleId = 'realistic' | 'anime' | 'oil-painting' | 'watercolor' | 'sketch'

/** 图片风格选项 */
export interface ImageStyle {
  id: ImageStyleId
  name: string
}

/** 图片尺寸选项 */
export interface ImageSizeOption {
  value: string
  label: string
}

/** 生成请求参数 */
export interface ImageGenerateParams {
  prompt: string
  size: string
  style: string
}

/** 生成结果 */
export interface ImageGenerateResult {
  url: string
  taskId: string
}

/** 历史记录项 */
export interface ImageHistoryItem {
  id: string
  prompt: string
  style: string
  size: string
  url: string
  createdAt: string
}
