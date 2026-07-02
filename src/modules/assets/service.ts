/**
 * 素材库 Service
 * 接真实后端 /assets API
 * 后端返回格式与前端不一致时，在 service 层做 adapter
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { assetsApi } from './api'
import { assetsMockApi } from './mock'
import type { AssetItem, AssetQueryParams, AssetListResult, CreateAssetParams, AssetType } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

/** 后端 user_assets 字段 → 前端 AssetItem */
function adaptAssetItem(raw: Record<string, unknown>): AssetItem {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    type: (raw.type as AssetType) ?? 'copy',
    content: String(raw.content ?? ''),
    createdAt: String(raw.created_at ?? ''),
  }
}

export const assetsService = {
  async getList(params?: AssetQueryParams): Promise<AssetListResult> {
    logger.info('[AssetsService] getList', params)
    try {
      if (useMock()) {
        const res = await assetsMockApi.getList(params)
        return res.data
      }
      const result = await assetsApi.getList(params)
      // 后端返回 { assets: [...] }，需要适配
      const rawList = (result as unknown as { assets: Record<string, unknown>[] }).assets ?? []
      const list = rawList.map(adaptAssetItem)
      return {
        list,
        total: list.length,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      }
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
      const result = await assetsApi.create(params)
      return adaptAssetItem(result as unknown as Record<string, unknown>)
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
