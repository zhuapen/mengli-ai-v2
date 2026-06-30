/**
 * 媒体库 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { mediaApi } from './api'
import { mediaMockApi } from './mock'
import type { KOL, MediaSearchParams } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const mediaService = {
  async searchKOLs(params?: MediaSearchParams): Promise<KOL[]> {
    logger.info('[MediaService] searchKOLs', params)
    try {
      if (useMock()) {
        const res = await mediaMockApi.searchKOLs(params)
        return res.data
      }
      return await mediaApi.searchKOLs(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '搜索达人失败'
      logger.error('[MediaService] searchKOLs failed', msg)
      throw new Error(msg)
    }
  },

  async getPlatforms(): Promise<string[]> {
    try {
      if (useMock()) {
        const res = await mediaMockApi.getPlatforms()
        return res.data
      }
      return await mediaApi.getPlatforms()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取平台失败'
      logger.error('[MediaService] getPlatforms failed', msg)
      throw new Error(msg)
    }
  },

  async getTags(): Promise<string[]> {
    try {
      if (useMock()) {
        const res = await mediaMockApi.getTags()
        return res.data
      }
      return await mediaApi.getTags()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取标签失败'
      logger.error('[MediaService] getTags failed', msg)
      throw new Error(msg)
    }
  },
}
