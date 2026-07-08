/**
 * AI 图片 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { imageApi } from './api'
import { imageMockApi } from './mock'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'
import type { ApiError } from '@/core/api/types'
import { ApiErrorCode } from '@/core/api/error-code'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 判断是否为超时类错误（后端 504 或前端 axios 超时） */
function isTimeoutError(e: unknown): boolean {
  if (e && typeof e === 'object' && 'code' in e) {
    const code = (e as ApiError).code
    return code === 504 || code === ApiErrorCode.RequestTimeout
  }
  return false
}

export const imageService = {
  async generate(params: ImageGenerateParams): Promise<ImageGenerateResult> {
    logger.info('[ImageService] generate', { prompt: params.prompt })
    try {
      if (useMock()) {
        const res = await imageMockApi.generate(params)
        return res.data
      }
      return await imageApi.generate(params)
    } catch (e) {
      if (isTimeoutError(e)) {
        logger.warn('[ImageService] generate timeout', (e as ApiError).code)
        throw new Error('图片生成超时，请稍后重试')
      }
      const msg = e instanceof Error ? e.message : '图片生成失败，请稍后重试'
      logger.error('[ImageService] generate failed', msg)
      throw new Error(msg)
    }
  },

  async getStyles(): Promise<ImageStyle[]> {
    logger.info('[ImageService] getStyles')
    try {
      if (useMock()) {
        const res = await imageMockApi.getStyles()
        return res.data
      }
      return await imageApi.getStyles()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取风格失败'
      logger.error('[ImageService] getStyles failed', msg)
      throw new Error(msg)
    }
  },

  async getHistory(): Promise<ImageHistoryItem[]> {
    logger.info('[ImageService] getHistory')
    try {
      if (useMock()) {
        const res = await imageMockApi.getHistory()
        return res.data
      }
      return await imageApi.getHistory()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取历史失败'
      logger.error('[ImageService] getHistory failed', msg)
      throw new Error(msg)
    }
  },
}
