/**
 * 插件中心 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type { PluginItem, PluginQueryParams, PluginListResult, PluginCategory } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const plugins: PluginItem[] = [
  { id: '1', name: '小红书数据采集', description: '一键采集小红书笔记数据，包括点赞、评论、收藏等', icon: '📊', version: '1.2.0', downloads: 1250, category: '数据采集' },
  { id: '2', name: '抖音达人分析', description: '分析抖音达人的粉丝画像、互动数据、商业价值', icon: '📱', version: '2.0.1', downloads: 890, category: '数据分析' },
  { id: '3', name: '文案批量生成', description: '基于模板批量生成多平台文案，支持小红书、朋友圈等', icon: '✍️', version: '1.5.0', downloads: 2100, category: 'AI工具' },
  { id: '4', name: '图片批量处理', description: '批量压缩、裁剪、添加水印，支持多种尺寸', icon: '🖼️', version: '1.0.3', downloads: 560, category: '图片处理' },
]

const categories: PluginCategory[] = [
  { id: 'all', name: '全部' },
  { id: 'data', name: '数据采集', icon: '📊' },
  { id: 'analysis', name: '数据分析', icon: '📈' },
  { id: 'ai', name: 'AI工具', icon: '🤖' },
  { id: 'image', name: '图片处理', icon: '🖼️' },
]

export const pluginMockApi = {
  async getList(params?: PluginQueryParams): Promise<ApiResponse<PluginListResult>> {
    await delay(500)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    let filtered = [...plugins]
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw))
    }
    return {
      code: 0, message: 'success', success: true,
      data: { list: filtered, total: filtered.length, page, pageSize },
    }
  },

  async getDetail(id: string): Promise<ApiResponse<PluginItem>> {
    await delay(300)
    const plugin = plugins.find((p) => p.id === id)
    if (!plugin) {
      return { code: 404, message: '插件不存在', success: false, data: undefined as unknown as PluginItem }
    }
    return { code: 0, message: 'success', success: true, data: plugin }
  },

  async getCategories(): Promise<ApiResponse<PluginCategory[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: categories }
  },

  async enable(id: string): Promise<ApiResponse<PluginItem>> {
    await delay(500)
    const plugin = plugins.find((p) => p.id === id)!
    return { code: 0, message: 'success', success: true, data: plugin }
  },

  async disable(id: string): Promise<ApiResponse<PluginItem>> {
    await delay(500)
    const plugin = plugins.find((p) => p.id === id)!
    return { code: 0, message: 'success', success: true, data: plugin }
  },
}
