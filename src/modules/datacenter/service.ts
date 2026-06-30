/**
 * 数据中心 Service
 *
 * ⚠️ 临时 fallback：后端 /datacenter 接口尚未实现
 * 当前策略：直接使用 mock 数据
 * 待后端 datacenter API 实现后，移除 FALLBACK_TO_MOCK，恢复标准 mock/api 切换
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

/** 后端接口就绪后将此常量改为 false 或移除整个 fallback 逻辑 */
const FALLBACK_TO_MOCK = true

function useMock(): boolean {
  return isFeatureEnabled('enableMock') || FALLBACK_TO_MOCK
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
      logger.error('[DatacenterService] getFeatures failed, falling back to mock', msg)
      const res = await datacenterMockApi.getFeatures()
      return res.data
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
      logger.error('[DatacenterService] getOverview failed, falling back to mock', msg)
      const res = await datacenterMockApi.getOverview(params)
      return res.data
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
      logger.error('[DatacenterService] getTrends failed, falling back to mock', msg)
      const res = await datacenterMockApi.getTrends(params)
      return res.data
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
      logger.error('[DatacenterService] getChannels failed, falling back to mock', msg)
      const res = await datacenterMockApi.getChannels(params)
      return res.data
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
      logger.error('[DatacenterService] getTopContents failed, falling back to mock', msg)
      const res = await datacenterMockApi.getTopContents(params)
      return res.data
    }
  },
}
