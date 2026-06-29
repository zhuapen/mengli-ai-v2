/**
 * 素材库 Mock API
 */
import type { ApiResponse } from '@/core/api/types'
import type { PaginatedData } from '@/core/api/types'

export interface Asset {
  id: string
  type: 'image' | 'copy' | 'article'
  title: string
  content: string
  createdAt: string
}

export interface AssetListParams {
  page?: number
  pageSize?: number
  type?: string
  keyword?: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const assetsData: Asset[] = [
  { id: '1', type: 'image', title: '产品宣传图', content: 'https://via.placeholder.com/300x200', createdAt: '2024-06-25' },
  { id: '2', type: 'copy', title: '小红书种草文案', content: '这款精华液真的绝了！用了一周皮肤状态明显变好...', createdAt: '2024-06-25' },
  { id: '3', type: 'article', title: '品牌营销指南', content: '如何做好品牌营销？这5个技巧你必须知道...', createdAt: '2024-06-24' },
  { id: '4', type: 'image', title: '社交媒体配图', content: 'https://via.placeholder.com/300x200', createdAt: '2024-06-24' },
  { id: '5', type: 'copy', title: '朋友圈推广文案', content: '新品上市！限时优惠，错过再等一年...', createdAt: '2024-06-23' },
]

export const assetsMockApi = {
  async getList(params?: AssetListParams): Promise<ApiResponse<PaginatedData<Asset>>> {
    await delay(500)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10

    let filtered = [...assetsData]
    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter((item) => item.type === params.type)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(kw))
    }

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

  async deleteItem(_id: string): Promise<ApiResponse<null>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: null }
  },
}
