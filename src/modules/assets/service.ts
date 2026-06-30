/**
 * 素材库 Service
 *
 * ⚠️ 临时 fallback：后端 /assets 接口尚未完全就绪
 * 当前策略：尝试真实 API，失败时回退到 mock 数据
 * 待后端 assets API 稳定后，移除 fallbackMock 标记，恢复标准 mock/api 切换
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { assetsApi } from './api'
import { assetsMockApi } from './mock'
import type { AssetItem, AssetQueryParams, AssetListResult, CreateAssetParams } from './types'

/** 后端接口就绪后将此常量改为 false 或移除整个 fallback 逻辑 */
const FALLBACK_TO_MOCK = true

function useMock(): boolean {
  return isFeatureEnabled('enableMock') || FALLBACK_TO_MOCK
}

export const assetsService = {
  async getList(params?: AssetQueryParams): Promise<AssetListResult> {
    logger.info('[AssetsService] getList', params)
    try {
      if (useMock()) {
        const res = await assetsMockApi.getList(params)
        return res.data
      }
      return await assetsApi.getList(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取素材列表失败'
      logger.error('[AssetsService] getList failed, falling back to mock', msg)
      const res = await assetsMockApi.getList(params)
      return res.data
    }
  },

  async create(params: CreateAssetParams): Promise<AssetItem> {
    logger.info('[AssetsService] create', { title: params.title })
    try {
      if (useMock()) {
        const res = await assetsMockApi.create(params)
        return res.data
      }
      return await assetsApi.create(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '创建素材失败'
      logger.error('[AssetsService] create failed, falling back to mock', msg)
      const res = await assetsMockApi.create(params)
      return res.data
    }
  },

  async remove(id: string): Promise<void> {
    logger.info('[AssetsService] remove', { id })
    try {
      if (useMock()) {
        await assetsMockApi.remove(id)
      } else {
        await assetsApi.remove(id)
      }
      logger.info('[AssetsService] remove success')
    } catch (e) {
      const msg = e instanceof Error ? e.message : '删除素材失败'
      logger.error('[AssetsService] remove failed', msg)
      throw new Error(msg)
    }
  },
}
