/**
 * 插件中心 Mock 数据
 */

export interface Plugin {
  id: string
  name: string
  description: string
  icon: string
  version: string
  downloads: number
  category: string
}

export const mockPlugins: Plugin[] = [
  {
    id: '1',
    name: '小红书数据采集',
    description: '一键采集小红书笔记数据，包括点赞、评论、收藏等',
    icon: '📊',
    version: '1.2.0',
    downloads: 1250,
    category: '数据采集',
  },
  {
    id: '2',
    name: '抖音达人分析',
    description: '分析抖音达人的粉丝画像、互动数据、商业价值',
    icon: '📱',
    version: '2.0.1',
    downloads: 890,
    category: '数据分析',
  },
  {
    id: '3',
    name: '文案批量生成',
    description: '基于模板批量生成多平台文案，支持小红书、朋友圈等',
    icon: '✍️',
    version: '1.5.0',
    downloads: 2100,
    category: 'AI工具',
  },
  {
    id: '4',
    name: '图片批量处理',
    description: '批量压缩、裁剪、添加水印，支持多种尺寸',
    icon: '🖼️',
    version: '1.0.3',
    downloads: 560,
    category: '图片处理',
  },
]
