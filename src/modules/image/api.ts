/**
 * AI 图片真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'

/**
 * AI 生成接口超时时间（150秒）
 * 后端 provider timeout 为 120s，前端需预留 30s 余量，
 * 确保能收到后端 504 响应而非 axios 自身 ECONNABORTED
 */
const AI_GENERATION_TIMEOUT = 150_000

export const imageApi = {
  /** 生成图片 */
  generate(params: ImageGenerateParams): Promise<ImageGenerateResult> {
    return api.post<ImageGenerateResult>('/image/generate', params, {
      timeout: AI_GENERATION_TIMEOUT,
    })
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
