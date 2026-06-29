/**
 * 数据中心 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { datacenterService } from './service'
import type {
  DataCenterFeature,
  MetricCard,
  TrendPoint,
  ChannelMetric,
  TopContentItem,
  DateRange,
} from './types'

export const useDatacenterStore = defineStore('datacenter', () => {
  // ===== State =====
  const loading = ref(false)
  const error = ref<string | null>(null)
  const features = ref<DataCenterFeature[]>([])
  const metrics = ref<MetricCard[]>([])
  const trends = ref<TrendPoint[]>([])
  const channels = ref<ChannelMetric[]>([])
  const topContents = ref<TopContentItem[]>([])
  const range = ref<DateRange>('7d')

  // ===== Actions =====

  /** 加载功能卡片 */
  async function fetchFeatures(): Promise<void> {
    error.value = null
    try {
      features.value = await datacenterService.getFeatures()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取功能列表失败'
    }
  }

  /** 加载概览数据 */
  async function fetchOverview(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const overview = await datacenterService.getOverview({ range: range.value })
      metrics.value = overview.metrics
      trends.value = overview.trends
      channels.value = overview.channels
      topContents.value = overview.topContents
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取概览失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载趋势数据 */
  async function fetchTrends(): Promise<void> {
    error.value = null
    try {
      trends.value = await datacenterService.getTrends({ range: range.value })
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取趋势失败'
    }
  }

  /** 加载渠道数据 */
  async function fetchChannels(): Promise<void> {
    error.value = null
    try {
      channels.value = await datacenterService.getChannels({ range: range.value })
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取渠道失败'
    }
  }

  /** 加载热门内容 */
  async function fetchTopContents(): Promise<void> {
    error.value = null
    try {
      topContents.value = await datacenterService.getTopContents({ range: range.value })
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取热门内容失败'
    }
  }

  /** 设置日期范围 */
  function setRange(r: DateRange): void {
    range.value = r
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  /** 初始化 */
  async function init(): Promise<void> {
    await fetchFeatures()
  }

  return {
    loading,
    error,
    features,
    metrics,
    trends,
    channels,
    topContents,
    range,
    fetchFeatures,
    fetchOverview,
    fetchTrends,
    fetchChannels,
    fetchTopContents,
    setRange,
    clearError,
    init,
  }
})
