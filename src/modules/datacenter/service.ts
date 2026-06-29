/**
 * 数据中心 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { datacenterApi } from './api'
import { datacenterMockApi } from './mock'
import type {
  DataCenterFeature,
  DatacenterOverview,
  DatacenterQueryParams,
  TrendPoint,
  ChannelMetric,
  TopContentItem,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const datacenterService = {
  async getFeatures(): Promise<DataCenterFeature[]> {
    logger.info('[DatacenterService] getFeatures')
    try {
      if (useMock()) {
        const res = await datacenterMockApi.getFeatures()
        return res.data
      }
      return await datacenterApi.getFeatures()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取功能列表失败'
      logger.error('[DatacenterService] getFeatures failed', msg)
      throw new Error(msg)
    }
  },

  async getOverview(params: DatacenterQueryParams): Promise<DatacenterOverview> {
    logger.info('[DatacenterService] getOverview', params)
    try {
      if (useMock()) {
        const res = await datacenterMockApi.getOverview(params)
        return res.data
      }
      return await datacenterApi.getOverview(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取概览数据失败'
      logger.error('[DatacenterService] getOverview failed', msg)
      throw new Error(msg)
    }
  },

  async getTrends(params: DatacenterQueryParams): Promise<TrendPoint[]> {
    logger.info('[DatacenterService] getTrends', params)
    try {
      if (useMock()) {
        const res = await datacenterMockApi.getTrends(params)
        return res.data
      }
      return await datacenterApi.getTrends(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取趋势数据失败'
      logger.error('[DatacenterService] getTrends failed', msg)
      throw new Error(msg)
    }
  },

  async getChannels(params: DatacenterQueryParams): Promise<ChannelMetric[]> {
    logger.info('[DatacenterService] getChannels', params)
    try {
      if (useMock()) {
        const res = await datacenterMockApi.getChannels(params)
        return res.data
      }
      return await datacenterApi.getChannels(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取渠道数据失败'
      logger.error('[DatacenterService] getChannels failed', msg)
      throw new Error(msg)
    }
  },

  async getTopContents(params: DatacenterQueryParams): Promise<TopContentItem[]> {
    logger.info('[DatacenterService] getTopContents', params)
    try {
      if (useMock()) {
        const res = await datacenterMockApi.getTopContents(params)
        return res.data
      }
      return await datacenterApi.getTopContents(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取热门内容失败'
      logger.error('[DatacenterService] getTopContents failed', msg)
      throw new Error(msg)
    }
  },
}
