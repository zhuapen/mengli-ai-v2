/**
 * 插件中心 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { pluginApi } from './api'
import { pluginMockApi } from './mock'
import type { PluginItem, PluginQueryParams, PluginListResult, PluginCategory } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const pluginService = {
  async getList(params?: PluginQueryParams): Promise<PluginListResult> {
    logger.info('[PluginService] getList', params)
    try {
      if (useMock()) {
        const res = await pluginMockApi.getList(params)
        return res.data
      }
      return await pluginApi.getList(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取插件列表失败'
      logger.error('[PluginService] getList failed', msg)
      throw new Error(msg)
    }
  },

  async getDetail(id: string): Promise<PluginItem | null> {
    logger.info('[PluginService] getDetail', { id })
    try {
      if (useMock()) {
        const res = await pluginMockApi.getDetail(id)
        return res.data
      }
      return await pluginApi.getDetail(id)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取插件详情失败'
      logger.error('[PluginService] getDetail failed', msg)
      throw new Error(msg)
    }
  },

  async getCategories(): Promise<PluginCategory[]> {
    logger.info('[PluginService] getCategories')
    try {
      if (useMock()) {
        const res = await pluginMockApi.getCategories()
        return res.data
      }
      return await pluginApi.getCategories()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取分类失败'
      logger.error('[PluginService] getCategories failed', msg)
      throw new Error(msg)
    }
  },

  async enable(id: string): Promise<PluginItem> {
    logger.info('[PluginService] enable', { id })
    try {
      if (useMock()) {
        const res = await pluginMockApi.enable(id)
        return res.data
      }
      return await pluginApi.enable(id)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '启用插件失败'
      logger.error('[PluginService] enable failed', msg)
      throw new Error(msg)
    }
  },

  async disable(id: string): Promise<PluginItem> {
    logger.info('[PluginService] disable', { id })
    try {
      if (useMock()) {
        const res = await pluginMockApi.disable(id)
        return res.data
      }
      return await pluginApi.disable(id)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '禁用插件失败'
      logger.error('[PluginService] disable failed', msg)
      throw new Error(msg)
    }
  },
}
