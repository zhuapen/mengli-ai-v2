/**
 * 数据中心真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type {
  DataCenterFeature,
  DatacenterOverview,
  DatacenterQueryParams,
  TrendPoint,
  ChannelMetric,
  TopContentItem,
} from './types'

export const datacenterApi = {
  /** 获取功能卡片 */
  getFeatures(): Promise<DataCenterFeature[]> {
    return api.get<DataCenterFeature[]>('/datacenter/features')
  },

  /** 获取概览数据 */
  getOverview(params: DatacenterQueryParams): Promise<DatacenterOverview> {
    return api.get<DatacenterOverview>('/datacenter/overview', { params })
  },

  /** 获取趋势数据 */
  getTrends(params: DatacenterQueryParams): Promise<TrendPoint[]> {
    return api.get<TrendPoint[]>('/datacenter/trends', { params })
  },

  /** 获取渠道数据 */
  getChannels(params: DatacenterQueryParams): Promise<ChannelMetric[]> {
    return api.get<ChannelMetric[]>('/datacenter/channels', { params })
  },

  /** 获取热门内容 */
  getTopContents(params: DatacenterQueryParams): Promise<TopContentItem[]> {
    return api.get<TopContentItem[]>('/datacenter/top-contents', { params })
  },
}
