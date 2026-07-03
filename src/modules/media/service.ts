/**
 * 媒体库 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 *
 * 生产环境安全 fallback：
 * - searchKOLs() 返回空数组，不请求后端
 * - getPlatforms() 返回本地静态平台配置
 * - getTags() 返回本地静态标签配置
 * - 不展示 mock 假达人，避免误导用户
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { mediaMockApi } from './mock'
import type { KOL, MediaSearchParams } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 本地静态平台配置（生产环境使用） */
const LOCAL_PLATFORMS = ['全部', '小红书', '抖音', 'B站', '微博', '快手']

/** 本地静态标签配置（生产环境使用） */
const LOCAL_TAGS = ['穿搭', '时尚', '美食', '科技', '美妆', '健身', '旅行', '母婴']

export const mediaService = {
  async searchKOLs(params?: MediaSearchParams): Promise<KOL[]> {
    logger.info('[MediaService] searchKOLs', params)

    // 生产环境：返回空数组，不请求后端
    if (!useMock()) {
      logger.info('[MediaService] searchKOLs: production fallback, returning empty list')
      return []
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await mediaMockApi.searchKOLs(params)
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '搜索达人失败'
      logger.error('[MediaService] searchKOLs failed', msg)
      throw new Error(msg)
    }
  },

  async getPlatforms(): Promise<string[]> {
    // 生产环境：返回本地静态配置
    if (!useMock()) {
      logger.info('[MediaService] getPlatforms: production fallback, using local config')
      return LOCAL_PLATFORMS
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await mediaMockApi.getPlatforms()
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取平台失败'
      logger.error('[MediaService] getPlatforms failed', msg)
      throw new Error(msg)
    }
  },

  async getTags(): Promise<string[]> {
    // 生产环境：返回本地静态配置
    if (!useMock()) {
      logger.info('[MediaService] getTags: production fallback, using local config')
      return LOCAL_TAGS
    }

    // 开发环境：使用 mock 数据
    try {
      const res = await mediaMockApi.getTags()
      return res.data
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取标签失败'
      logger.error('[MediaService] getTags failed', msg)
      throw new Error(msg)
    }
  },
}
