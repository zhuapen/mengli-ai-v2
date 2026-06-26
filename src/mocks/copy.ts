/**
 * AI 文案 Mock 数据
 */

export interface CopyTemplate {
  id: string
  name: string
  prompt: string
  category: string
}

export const mockCopyTemplates: CopyTemplate[] = [
  {
    id: '1',
    name: '小红书种草文案',
    prompt: '请为{product}写一篇小红书种草文案，风格活泼，突出产品亮点',
    category: '种草',
  },
  {
    id: '2',
    name: '朋友圈推广文案',
    prompt: '请为{product}写一条朋友圈推广文案，简洁有吸引力',
    category: '推广',
  },
  {
    id: '3',
    name: '产品详情页文案',
    prompt: '请为{product}写一段产品详情页文案，突出卖点和使用场景',
    category: '详情',
  },
]

export interface CopyHistory {
  id: string
  prompt: string
  content: string
  createdAt: string
}

export const mockCopyHistory: CopyHistory[] = [
  {
    id: '1',
    prompt: '为护肤品写小红书文案',
    content: '【种草】这款精华液真的绝了！用了一周皮肤状态明显变好...',
    createdAt: '2024-06-25 14:30:00',
  },
  {
    id: '2',
    prompt: '为新品口红写推广文案',
    content: '新品上市！这款口红颜色太美了，质地丝滑不拔干...',
    createdAt: '2024-06-25 10:15:00',
  },
]
