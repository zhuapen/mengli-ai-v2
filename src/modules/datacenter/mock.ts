/**
 * 数据中心 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type {
  DataCenterFeature,
  DatacenterOverview,
  DatacenterQueryParams,
  TrendPoint,
  ChannelMetric,
  TopContentItem,
} from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const features: DataCenterFeature[] = [
  { id: 'plugin', icon: '🧩', title: '数据中心', description: '运营工具、浏览器插件、自动化工具下载', route: '/plugin' },
  { id: 'analysis', icon: '📊', title: 'KOL 分析', description: '达人数据分析、粉丝画像、互动趋势、商业价值评估', route: null },
  { id: 'media-library', icon: '📚', title: '智能媒体库', description: 'AI Brief 拆解 · 蒲公英采集 · 达人推荐 · 项目管理', route: '/media' },
]

export const datacenterMockApi = {
  async getFeatures(): Promise<ApiResponse<DataCenterFeature[]>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: features }
  },

  async getOverview(_params: DatacenterQueryParams): Promise<ApiResponse<DatacenterOverview>> {
    await delay(800)
    return {
      code: 0, message: 'success', success: true,
      data: {
        metrics: [
          { key: 'views', label: '总浏览量', value: 125000, changeRate: 12.5 },
          { key: 'likes', label: '总点赞数', value: 8900, changeRate: 8.3 },
          { key: 'comments', label: '总评论数', value: 2100, changeRate: -2.1 },
          { key: 'conversion', label: '转化率', value: 3.2, unit: '%', changeRate: 0.5 },
        ],
        trends: Array.from({ length: 7 }, (_, i) => ({ date: `2026-06-${22 + i}`, value: Math.floor(Math.random() * 10000) + 5000 })),
        channels: [
          { channel: '小红书', views: 50000, likes: 3500, comments: 800, conversionRate: 4.2 },
          { channel: '抖音', views: 45000, likes: 3200, comments: 900, conversionRate: 3.8 },
          { channel: 'B站', views: 30000, likes: 2200, comments: 400, conversionRate: 2.1 },
        ],
        topContents: [
          { id: '1', title: '小红书种草笔记 #1', type: 'copy', views: 12000, likes: 890, createdAt: '2026-06-28' },
          { id: '2', title: '产品宣传图 #2', type: 'image', views: 8500, likes: 620, createdAt: '2026-06-27' },
        ],
      },
    }
  },

  async getTrends(_params: DatacenterQueryParams): Promise<ApiResponse<TrendPoint[]>> {
    await delay(500)
    return {
      code: 0, message: 'success', success: true,
      data: Array.from({ length: 7 }, (_, i) => ({ date: `2026-06-${22 + i}`, value: Math.floor(Math.random() * 10000) + 5000 })),
    }
  },

  async getChannels(_params: DatacenterQueryParams): Promise<ApiResponse<ChannelMetric[]>> {
    await delay(500)
    return {
      code: 0, message: 'success', success: true,
      data: [
        { channel: '小红书', views: 50000, likes: 3500, comments: 800, conversionRate: 4.2 },
        { channel: '抖音', views: 45000, likes: 3200, comments: 900, conversionRate: 3.8 },
        { channel: 'B站', views: 30000, likes: 2200, comments: 400, conversionRate: 2.1 },
      ],
    }
  },

  async getTopContents(_params: DatacenterQueryParams): Promise<ApiResponse<TopContentItem[]>> {
    await delay(500)
    return {
      code: 0, message: 'success', success: true,
      data: [
        { id: '1', title: '小红书种草笔记 #1', type: 'copy', views: 12000, likes: 890, createdAt: '2026-06-28' },
        { id: '2', title: '产品宣传图 #2', type: 'image', views: 8500, likes: 620, createdAt: '2026-06-27' },
      ],
    }
  },
}
