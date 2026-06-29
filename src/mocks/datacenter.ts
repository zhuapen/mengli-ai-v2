/**
 * 数据中心 Mock API
 */
import type { ApiResponse } from '@/core/api/types'

export interface DataCenterFeature {
  id: string
  icon: string
  title: string
  description: string
  route: string | null
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const features: DataCenterFeature[] = [
  {
    id: 'plugin',
    icon: '🧩',
    title: '数据中心',
    description: '运营工具、浏览器插件、自动化工具下载',
    route: '/plugin',
  },
  {
    id: 'analysis',
    icon: '📊',
    title: 'KOL 分析',
    description: '达人数据分析、粉丝画像、互动趋势、商业价值评估',
    route: null,
  },
  {
    id: 'media-library',
    icon: '📚',
    title: '智能媒体库',
    description: 'AI Brief 拆解 · 蒲公英采集 · 达人推荐 · 项目管理',
    route: '/media',
  },
]

export const datacenterMockApi = {
  async getFeatures(): Promise<ApiResponse<DataCenterFeature[]>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: features }
  },
}
