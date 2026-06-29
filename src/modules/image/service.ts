/**
 * AI 图片 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { imageApi } from './api'
import { imageMockApi } from './mock'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
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
      const msg = e instanceof Error ? e.message : '图片生成失败'
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
