/**
 * 素材库 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { assetsApi } from './api'
import { assetsMockApi } from './mock'
import type { AssetItem, AssetQueryParams, AssetListResult, CreateAssetParams } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
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
      logger.error('[AssetsService] getList failed', msg)
      throw new Error(msg)
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
      logger.error('[AssetsService] create failed', msg)
      throw new Error(msg)
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
