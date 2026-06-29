/**
 * 插件中心真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { PluginItem, PluginQueryParams, PluginListResult, PluginCategory } from './types'

export const pluginApi = {
  /** 获取插件列表 */
  getList(params?: PluginQueryParams): Promise<PluginListResult> {
    return api.get<PluginListResult>('/plugins', { params })
  },

  /** 获取插件详情 */
  getDetail(id: string): Promise<PluginItem> {
    return api.get<PluginItem>(`/plugins/${id}`)
  },

  /** 获取插件分类 */
  getCategories(): Promise<PluginCategory[]> {
    return api.get<PluginCategory[]>('/plugins/categories')
  },

  /** 启用插件 */
  enable(id: string): Promise<PluginItem> {
    return api.post<PluginItem>(`/plugins/${id}/enable`)
  },

  /** 禁用插件 */
  disable(id: string): Promise<PluginItem> {
    return api.post<PluginItem>(`/plugins/${id}/disable`)
  },
}
