/**
 * AI 图片 Mock API
 */
import type { ApiResponse } from '@/core/api/types'

export interface ImageGenerateRequest {
  prompt: string
  size: string
  style: string
}

export interface ImageGenerateResponse {
  url: string
  taskId: string
}

export interface ImageStyle {
  id: string
  name: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const sizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']

const styles: ImageStyle[] = [
  { id: 'realistic', name: '写实' },
  { id: 'anime', name: '动漫' },
  { id: 'oil-painting', name: '油画' },
  { id: 'watercolor', name: '水彩' },
  { id: 'sketch', name: '素描' },
]

export const imageMockApi = {
  async generate(params: ImageGenerateRequest): Promise<ApiResponse<ImageGenerateResponse>> {
    await delay(2000)
    const [w, h] = params.size.split('x')
    return {
      code: 0,
      message: 'success',
      data: {
        url: `https://via.placeholder.com/${w}x${h}`,
        taskId: `task_${Date.now()}`,
      },
    }
  },

  async getSizes(): Promise<ApiResponse<string[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: sizes }
  },

  async getStyles(): Promise<ApiResponse<ImageStyle[]>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: styles }
  },
}
