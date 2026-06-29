/**
 * 历史记录 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type { HistoryItem, HistoryQueryParams, HistoryListResult } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const historyData: HistoryItem[] = [
  { id: '1', type: 'copy', title: '小红书种草文案', content: '【种草】这款精华液真的绝了！用了一周皮肤状态明显变好...', createdAt: '2026-06-28 14:30:00' },
  { id: '2', type: 'image', title: 'AI生成图片', content: '一只可爱的橘猫在阳光下打盹', createdAt: '2026-06-28 16:00:00' },
  { id: '3', type: 'article', title: '公众号文章', content: '如何做好品牌营销？这5个技巧你必须知道...', createdAt: '2026-06-27 10:00:00' },
  { id: '4', type: 'copy', title: '朋友圈推广文案', content: '新品上市！限时优惠，错过再等一年...', createdAt: '2026-06-27 09:15:00' },
]

export const historyMockApi = {
  async getList(params?: HistoryQueryParams): Promise<ApiResponse<HistoryListResult>> {
    await delay(500)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10

    const filtered = params?.type && params.type !== 'all'
      ? historyData.filter((item) => item.type === params.type)
      : historyData

    return {
      code: 0, message: 'success', success: true,
      data: { list: filtered, total: filtered.length, page, pageSize },
    }
  },

  async remove(_id: string): Promise<ApiResponse<void>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: undefined }
  },

  async clear(): Promise<ApiResponse<void>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: undefined }
  },
}
