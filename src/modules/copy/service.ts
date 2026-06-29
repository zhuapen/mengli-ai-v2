/**
 * 小红书文案 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { copyApi } from './api'
import { copyMockApi } from './mock'
import type {
  CopyGenerateParams,
  CopyGenerateResult,
  CopyRefineParams,
  CopyTemplate,
  BrandOption,
  CopyHistoryItem,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const copyService = {
  async generate(params: CopyGenerateParams): Promise<CopyGenerateResult> {
    logger.info('[CopyService] generate', { product: params.product })
    try {
      if (useMock()) {
        const res = await copyMockApi.generate(params)
        return res.data
      }
      return await copyApi.generate(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文案生成失败'
      logger.error('[CopyService] generate failed', msg)
      throw new Error(msg)
    }
  },

  async refine(params: CopyRefineParams): Promise<CopyGenerateResult> {
    logger.info('[CopyService] refine')
    try {
      if (useMock()) {
        const res = await copyMockApi.refine(params)
        return res.data
      }
      return await copyApi.refine(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文案优化失败'
      logger.error('[CopyService] refine failed', msg)
      throw new Error(msg)
    }
  },

  async getTemplates(): Promise<CopyTemplate[]> {
    logger.info('[CopyService] getTemplates')
    try {
      if (useMock()) {
        const res = await copyMockApi.getTemplates()
        return res.data
      }
      return await copyApi.getTemplates()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取模板失败'
      logger.error('[CopyService] getTemplates failed', msg)
      throw new Error(msg)
    }
  },

  async getBrands(): Promise<BrandOption[]> {
    logger.info('[CopyService] getBrands')
    try {
      if (useMock()) {
        const res = await copyMockApi.getBrands()
        return res.data
      }
      return await copyApi.getBrands()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取品牌失败'
      logger.error('[CopyService] getBrands failed', msg)
      throw new Error(msg)
    }
  },

  async getHistory(): Promise<CopyHistoryItem[]> {
    logger.info('[CopyService] getHistory')
    try {
      if (useMock()) {
        const res = await copyMockApi.getHistory()
        return res.data
      }
      return await copyApi.getHistory()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取历史失败'
      logger.error('[CopyService] getHistory failed', msg)
      throw new Error(msg)
    }
  },
}
