/**
 * 历史记录真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { HistoryQueryParams, HistoryListResult } from './types'

export const historyApi = {
  /** 获取历史列表（分页） */
  getList(params?: HistoryQueryParams): Promise<HistoryListResult> {
    return api.get<HistoryListResult>('/history', { params })
  },

  /** 删除单条历史 */
  remove(id: string): Promise<void> {
    return api.delete<void>(`/history/${id}`)
  },

  /** 清空全部历史 */
  clear(): Promise<void> {
    return api.delete<void>('/history')
  },
}
