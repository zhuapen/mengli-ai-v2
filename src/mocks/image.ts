/**
 * AI 图片 Mock 数据
 */

export interface ImageTask {
  id: string
  prompt: string
  size: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  url?: string
  createdAt: string
}

export const mockImageHistory: ImageTask[] = [
  {
    id: '1',
    prompt: '一只可爱的橘猫在阳光下打盹',
    size: '1024x1024',
    status: 'completed',
    url: 'https://via.placeholder.com/1024',
    createdAt: '2024-06-25 16:00:00',
  },
  {
    id: '2',
    prompt: '现代简约风格的客厅设计',
    size: '1792x1024',
    status: 'completed',
    url: 'https://via.placeholder.com/1792x1024',
    createdAt: '2024-06-25 15:30:00',
  },
]

export const mockImageSizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']

export const mockImageStyles = [
  { id: 'realistic', name: '写实' },
  { id: 'anime', name: '动漫' },
  { id: 'oil-painting', name: '油画' },
  { id: 'watercolor', name: '水彩' },
  { id: 'sketch', name: '素描' },
]
