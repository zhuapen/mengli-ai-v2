/**
 * 历史记录 Mock API
 */
import type { ApiResponse } from '@/core/api/types'
import type { PaginatedData } from '@/core/api/types'

export interface HistoryItem {
  id: string
  type: 'copy' | 'image' | 'article'
  title: string
  content: string
  createdAt: string
}

export interface HistoryListParams {
  page?: number
  pageSize?: number
  type?: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const historyData: HistoryItem[] = [
  {
    id: '1',
    type: 'copy',
    title: '小红书种草文案',
    content: '【种草】这款精华液真的绝了！用了一周皮肤状态明显变好...',
    createdAt: '2024-06-25 14:30:00',
  },
  {
    id: '2',
    type: 'image',
    title: 'AI生成图片',
    content: '一只可爱的橘猫在阳光下打盹',
    createdAt: '2024-06-25 16:00:00',
  },
  {
    id: '3',
    type: 'article',
    title: '公众号文章',
    content: '如何做好品牌营销？这5个技巧你必须知道...',
    createdAt: '2024-06-24 10:00:00',
  },
  {
    id: '4',
    type: 'copy',
    title: '朋友圈推广文案',
    content: '新品上市！限时优惠，错过再等一年...',
    createdAt: '2024-06-24 09:15:00',
  },
]

export const historyMockApi = {
  async getList(params?: HistoryListParams): Promise<ApiResponse<PaginatedData<HistoryItem>>> {
    await delay(500)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    const type = params?.type

    const filtered = type && type !== 'all'
      ? historyData.filter((item) => item.type === type)
      : historyData

    return {
      code: 0,
      message: 'success',
      success: true,
      data: {
        list: filtered,
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      },
    }
  },
}
