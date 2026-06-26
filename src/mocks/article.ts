/**
 * 公众号写稿 Mock 数据
 */

export interface ArticleTemplate {
  id: string
  name: string
  description: string
}

export const mockArticleTemplates: ArticleTemplate[] = [
  {
    id: '1',
    name: '产品评测',
    description: '详细的产品使用体验和评测文章',
  },
  {
    id: '2',
    name: '行业分析',
    description: '深度行业分析和趋势解读',
  },
  {
    id: '3',
    name: '教程指南',
    description: '实用的操作教程和指南',
  },
]

export interface ArticleHistory {
  id: string
  title: string
  mode: 'outline' | 'draft'
  content: string
  createdAt: string
}

export const mockArticleHistory: ArticleHistory[] = [
  {
    id: '1',
    title: '品牌营销指南',
    mode: 'outline',
    content: '大纲内容...',
    createdAt: '2024-06-25 14:00:00',
  },
  {
    id: '2',
    title: '新品发布文案',
    mode: 'draft',
    content: '初稿内容...',
    createdAt: '2024-06-24 10:00:00',
  },
]
