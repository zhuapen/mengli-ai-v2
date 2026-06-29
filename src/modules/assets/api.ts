/**
 * 素材库真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { AssetItem, AssetQueryParams, AssetListResult, CreateAssetParams } from './types'

export const assetsApi = {
  /** 获取素材列表（分页） */
  getList(params?: AssetQueryParams): Promise<AssetListResult> {
    return api.get<AssetListResult>('/assets', { params })
  },

  /** 创建素材 */
  create(params: CreateAssetParams): Promise<AssetItem> {
    return api.post<AssetItem>('/assets', params)
  },

  /** 删除素材 */
  remove(id: string): Promise<void> {
    return api.delete<void>(`/assets/${id}`)
  },
}
