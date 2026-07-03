/**
 * 媒体库 Mock API
 * 返回结构必须与真实 api 完全一致
 */
import type { ApiResponse } from '@/core/api/types'
import type { KOL, MediaSearchParams } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const kolList: KOL[] = [
  {
    id: '1',
    name: '小美爱穿搭',
    platform: '小红书',
    avatar: '👗',
    followers: 125000,
    engagement: 5.2,
    tags: ['穿搭', '时尚', '种草'],
    price: 5000,
  },
  {
    id: '2',
    name: '美食达人阿强',
    platform: '抖音',
    avatar: '🍜',
    followers: 890000,
    engagement: 3.8,
    tags: ['美食', '探店', '教程'],
    price: 15000,
  },
  {
    id: '3',
    name: '科技小王子',
    platform: 'B站',
    avatar: '📱',
    followers: 450000,
    engagement: 6.1,
    tags: ['科技', '数码', '评测'],
    price: 8000,
  },
  {
    id: '4',
    name: '健身女神Lily',
    platform: '小红书',
    avatar: '💪',
    followers: 230000,
    engagement: 4.5,
    tags: ['健身', '运动', '生活方式'],
    price: 6000,
  },
]

const platforms = ['全部', '小红书', '抖音', 'B站', '微博', '快手']

const tags = ['穿搭', '时尚', '美食', '科技', '美妆', '健身', '旅行', '母婴']

export const mediaMockApi = {
  async searchKOLs(params?: MediaSearchParams): Promise<ApiResponse<KOL[]>> {
    await delay(800)
    let result = [...kolList]

    if (params?.platform && params.platform !== '全部') {
      result = result.filter((kol) => kol.platform === params.platform)
    }
    if (params?.tags && params.tags.length > 0) {
      result = result.filter((kol) => params.tags!.some((tag) => kol.tags.includes(tag)))
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      result = result.filter((kol) => kol.name.toLowerCase().includes(kw))
    }

    return { code: 0, message: 'success', success: true, data: result }
  },

  async getPlatforms(): Promise<ApiResponse<string[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: platforms }
  },

  async getTags(): Promise<ApiResponse<string[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: tags }
  },
}
