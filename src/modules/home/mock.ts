/**
 * 首页 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type { CaseStudy, AboutItem, HomeOverview, HomeRecentItem, HomeShortcut } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const caseStudies: CaseStudy[] = [
  { id: '1', title: '案例展示 1', image: '', description: '某知名品牌社交媒体营销' },
  { id: '2', title: '案例展示 2', image: '', description: '新品上市全渠道推广' },
  { id: '3', title: '案例展示 3', image: '', description: 'KOL 矩阵带货案例' },
]

const aboutItems: AboutItem[] = [
  { id: '1', title: '公司介绍', description: '萌力互动成立于2020年' },
  { id: '2', title: '团队风采', description: '专业团队100+人' },
  { id: '3', title: '合作伙伴', description: '服务500+品牌客户' },
]

const shortcuts: HomeShortcut[] = [
  { id: 's1', title: '小红书文案', description: 'AI 智能创作种草笔记', route: '/copy', icon: '✍️' },
  { id: 's2', title: '图片生成', description: 'AI 创意生图', route: '/image', icon: '🎨' },
  { id: 's3', title: '达人查找', description: '智能匹配达人', route: '/media', icon: '🔍' },
]

const recentItems: HomeRecentItem[] = [
  { id: 'r1', title: '小红书种草文案', type: 'copy', createdAt: '2026-06-28 14:30:00', route: '/copy' },
  { id: 'r2', title: '产品宣传图', type: 'image', createdAt: '2026-06-28 10:00:00', route: '/image' },
]

export const homeMockApi = {
  async getCaseStudies(): Promise<ApiResponse<CaseStudy[]>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: caseStudies }
  },

  async getAboutItems(): Promise<ApiResponse<AboutItem[]>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: aboutItems }
  },

  async getOverview(): Promise<ApiResponse<HomeOverview>> {
    await delay(600)
    return {
      code: 0, message: 'success', success: true,
      data: {
        stats: [
          { key: 'copies', label: '生成文案', value: 128, changeRate: 15.2 },
          { key: 'images', label: '生成图片', value: 56, changeRate: 8.7 },
          { key: 'articles', label: '生成文章', value: 23, changeRate: -3.1 },
        ],
        shortcuts,
        recentItems,
      },
    }
  },

  async getRecentItems(): Promise<ApiResponse<HomeRecentItem[]>> {
    await delay(400)
    return { code: 0, message: 'success', success: true, data: recentItems }
  },

  async getShortcuts(): Promise<ApiResponse<HomeShortcut[]>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: shortcuts }
  },
}
