/**
 * 历史记录 Service
 * 接真实后端 /history API
 * 后端返回格式与前端不一致时，在 service 层做 adapter
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { historyApi } from './api'
import { historyMockApi } from './mock'
import type { HistoryItem, HistoryQueryParams, HistoryListResult } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 后端 generation_history 字段 → 前端 HistoryItem */
function adaptHistoryItem(raw: Record<string, unknown>): HistoryItem {
  return {
    id: String(raw.id ?? ''),
    type: (raw.gen_type as HistoryItem['type']) ?? 'copy',
    title: String(raw.input_params ?? '').substring(0, 50) || '未命名记录',
    content: String(raw.output_content ?? ''),
    createdAt: String(raw.created_at ?? ''),
  }
}

export const historyService = {
  async getList(params?: HistoryQueryParams): Promise<HistoryListResult> {
    logger.info('[HistoryService] getList', params)
    try {
      if (useMock()) {
        const res = await historyMockApi.getList(params)
        return res.data
      }
      const result = await historyApi.getList(params)
      // 后端返回 { history: [...] }，需要适配
      const rawList = (result as unknown as { history: Record<string, unknown>[] }).history ?? []
      const list = rawList.map(adaptHistoryItem)
      return {
        list,
        total: list.length,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      }
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
