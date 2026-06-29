/**
 * 数据中心模块类型定义
 * 所有 datacenter 相关类型统一在此定义
 */

/** 功能卡片（当前 UI 使用） */
export interface DataCenterFeature {
  id: string
  icon: string
  title: string
  description: string
  route: string | null
}

/** 日期范围 */
export type DateRange = '7d' | '30d' | '90d' | 'custom'

/** 指标卡片 */
export interface MetricCard {
  key: string
  label: string
  value: number
  unit?: string
  changeRate?: number
}

/** 趋势数据点 */
export interface TrendPoint {
  date: string
  value: number
  label?: string
}

/** 渠道指标 */
export interface ChannelMetric {
  channel: string
  views: number
  likes: number
  comments: number
  conversionRate?: number
}

/** 热门内容 */
export interface TopContentItem {
  id: string
  title: string
  type: string
  views: number
  likes: number
  createdAt: string
}

/** 数据中心概览 */
export interface DatacenterOverview {
  metrics: MetricCard[]
  trends: TrendPoint[]
  channels: ChannelMetric[]
  topContents: TopContentItem[]
}

/** 查询参数 */
export interface DatacenterQueryParams {
  range: DateRange
  startDate?: string
  endDate?: string
}
