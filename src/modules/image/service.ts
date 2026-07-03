/**
 * AI 图片 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 *
 * 生产环境安全 fallback：
 * - generate() 不请求后端，返回明确的业务错误
 * - getStyles() 返回本地静态风格配置
 * - getHistory() 返回空数组
 * - 不展示 mock 假图片，避免误导用户
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { imageMockApi } from './mock'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 本地静态风格配置（生产环境使用） */
const LOCAL_STYLES: ImageStyle[] = [
  { id: 'realistic', name: '写实' },
  { id: 'anime', name: '动漫' },
  { id: 'oil-painting', name: '油画' },
  { id: 'watercolor', name: '水彩' },
  { id: 'sketch', name: '素描' },
]

export const imageService = {
  async generate(params: ImageGenerateParams): Promise<ImageGenerateResult> {
    logger.info('[ImageService] generate', { prompt: params.prompt })

    // 生产环境：返回明确的业务错误，不请求后端
    if (!useMock()) {
      logger.info('[ImageService] generate: production fallback, feature not available')
      throw new Error('图片生成功能接入中')
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await imageMockApi.generate(params)
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '图片生成失败'
      logger.error('[ImageService] generate failed', msg)
      throw new Error(msg)
    }
  },

  async getStyles(): Promise<ImageStyle[]> {
    // 生产环境：返回本地静态配置
    if (!useMock()) {
      logger.info('[ImageService] getStyles: production fallback, using local config')
      return LOCAL_STYLES
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await imageMockApi.getStyles()
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取风格失败'
      logger.error('[ImageService] getStyles failed', msg)
      throw new Error(msg)
    }
  },

  async getHistory(): Promise<ImageHistoryItem[]> {
    // 生产环境：返回空数组
    if (!useMock()) {
      logger.info('[ImageService] getHistory: production fallback, returning empty list')
      return []
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await imageMockApi.getHistory()
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取历史失败'
      logger.error('[ImageService] getHistory failed', msg)
      throw new Error(msg)
    }
  },
}
