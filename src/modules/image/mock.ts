/**
 * AI 图片 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type { ImageGenerateParams, ImageGenerateResult, ImageStyle, ImageHistoryItem } from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const styles: ImageStyle[] = [
  { id: 'realistic', name: '写实' },
  { id: 'anime', name: '动漫' },
  { id: 'oil-painting', name: '油画' },
  { id: 'watercolor', name: '水彩' },
  { id: 'sketch', name: '素描' },
]

export const imageMockApi = {
  async generate(params: ImageGenerateParams): Promise<ApiResponse<ImageGenerateResult>> {
    await delay(2000)
    const [w, h] = params.size.split('x')
    return {
      code: 0,
      message: 'success',
      success: true,
      data: {
        url: `https://via.placeholder.com/${w}x${h}`,
        taskId: `task_${Date.now()}`,
      },
    }
  },

  async getStyles(): Promise<ApiResponse<ImageStyle[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: styles }
  },

  async getHistory(): Promise<ApiResponse<ImageHistoryItem[]>> {
    await delay(500)
    return {
      code: 0,
      message: 'success',
      success: true,
      data: [
        { id: '1', prompt: '一只可爱的橘猫在阳光下打盹', style: 'realistic', size: '1024x1024', url: 'https://via.placeholder.com/1024x1024', createdAt: '2026-06-28 16:00:00' },
        { id: '2', prompt: '现代简约风格的客厅设计', style: 'realistic', size: '1792x1024', url: 'https://via.placeholder.com/1792x1024', createdAt: '2026-06-27 15:30:00' },
      ],
    }
  },
}
