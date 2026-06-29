/**
 * AI 图片真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'

export const imageApi = {
  /** 生成图片 */
  generate(params: ImageGenerateParams): Promise<ImageGenerateResult> {
    return api.post<ImageGenerateResult>('/image/generate', params)
  },

  /** 获取风格列表 */
  getStyles(): Promise<ImageStyle[]> {
    return api.get<ImageStyle[]>('/image/styles')
  },

  /** 获取生成历史 */
  getHistory(): Promise<ImageHistoryItem[]> {
    return api.get<ImageHistoryItem[]>('/image/history')
  },
}
