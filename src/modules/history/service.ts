/**
 * 历史记录 Service
 * 接真实后端 /history API
 * 后端返回格式与前端不一致时，在 service 层做 adapter
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { historyApi } from './api'
import { historyMockApi } from './mock'
import type { HistoryItem, HistoryQueryParams, HistoryListResult, HistoryType } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 安全解析 input_params，兼容对象/JSON字符串/普通字符串/空值 */
function parseInputParams(value: unknown): Record<string, unknown> {
  if (!value) return {}
  if (typeof value === 'object' && value !== null) return value as Record<string, unknown>
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, unknown>
    } catch {
      return { raw: value }
    }
  }
  return {}
}

/** 从 input_params 提取可读标题 */
function extractTitle(params: Record<string, unknown>, fallbackContent: string): string {
  // 优先取 product
  if (params.product && typeof params.product === 'string') return params.product
  if (params.topic && typeof params.topic === 'string') return params.topic
  if (params.title && typeof params.title === 'string') return params.title

  // copyType + product 组合
  if (params.copyType && params.product) {
    return `${params.copyType} · ${params.product}`
  }
  if (params.copyType && typeof params.copyType === 'string') return params.copyType

  // 兜底用 output_content 前 30 字
  if (fallbackContent && fallbackContent.length > 0) {
    return fallbackContent.substring(0, 30) + (fallbackContent.length > 30 ? '...' : '')
  }

  return '生成记录'
}

/** 后端 gen_type → 前端 HistoryType */
function normalizeHistoryType(genType: unknown): HistoryType {
  const valid: HistoryType[] = ['copy', 'image', 'article']
  const str = typeof genType === 'string' ? genType.toLowerCase() : ''
  if (valid.includes(str as HistoryType)) return str as HistoryType
  return 'copy' // 默认归为 copy
}

/** 后端 generation_history 字段 → 前端 HistoryItem */
function adaptHistoryItem(raw: Record<string, unknown>): HistoryItem {
  const content = String(raw.output_content ?? '')
  const inputParams = parseInputParams(raw.input_params)
  return {
    id: String(raw.id ?? ''),
    type: normalizeHistoryType(raw.gen_type),
    title: extractTitle(inputParams, content),
    content,
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
