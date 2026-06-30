/**
 * 历史记录 Service
 *
 * ⚠️ 临时 fallback：后端 /history 接口尚未完全就绪
 * 当前策略：尝试真实 API，失败时回退到 mock 数据
 * 待后端 history API 稳定后，移除 FALLBACK_TO_MOCK，恢复标准 mock/api 切换
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { historyApi } from './api'
import { historyMockApi } from './mock'
import type { HistoryQueryParams, HistoryListResult } from './types'

/** 后端接口就绪后将此常量改为 false 或移除整个 fallback 逻辑 */
const FALLBACK_TO_MOCK = true

function useMock(): boolean {
  return isFeatureEnabled('enableMock') || FALLBACK_TO_MOCK
}

export const historyService = {
  async getList(params?: HistoryQueryParams): Promise<HistoryListResult> {
    logger.info('[HistoryService] getList', params)
    try {
      if (useMock()) {
        const res = await historyMockApi.getList(params)
        return res.data
      }
      return await historyApi.getList(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取历史记录失败'
      logger.error('[HistoryService] getList failed, falling back to mock', msg)
      const res = await historyMockApi.getList(params)
      return res.data
    }
  },

  async remove(id: string): Promise<void> {
    logger.info('[HistoryService] remove', { id })
    try {
      if (useMock()) {
        await historyMockApi.remove(id)
      } else {
        await historyApi.remove(id)
      }
      logger.info('[HistoryService] remove success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '删除历史记录失败'
      logger.error('[HistoryService] remove failed', msg)
      throw new Error(msg)
    }
  },

  async clear(): Promise<void> {
    logger.info('[HistoryService] clear')
    try {
      if (useMock()) {
        await historyMockApi.clear()
      } else {
        await historyApi.clear()
      }
      logger.info('[HistoryService] clear success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '清空历史记录失败'
      logger.error('[HistoryService] clear failed', msg)
      throw new Error(msg)
    }
  },
}
