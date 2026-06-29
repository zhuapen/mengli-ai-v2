/**
 * 历史记录 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { historyApi } from './api'
import { historyMockApi } from './mock'
import type { HistoryQueryParams, HistoryListResult } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
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
      logger.error('[HistoryService] getList failed', msg)
      throw new Error(msg)
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
