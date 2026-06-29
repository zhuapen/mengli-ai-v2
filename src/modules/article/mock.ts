/**
 * 公众号写稿 Mock API
 * 返回结构必须与真实 api 完全一致
 * 模拟延迟只能写在这里
 */
import type { ApiResponse } from '@/core/api/types'
import type {
  ArticleGenerateParams,
  ArticleGenerateResult,
  ArticleTemplate,
  ArticleDraft,
  ArticleHistoryQueryParams,
  ArticleHistoryResult,
} from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const templates: ArticleTemplate[] = [
  { id: '1', name: '产品评测', description: '详细的产品使用体验和评测文章' },
  { id: '2', name: '行业分析', description: '深度行业分析和趋势解读' },
  { id: '3', name: '教程指南', description: '实用的操作教程和指南' },
]

const drafts: ArticleDraft[] = [
  { id: 'd1', title: '品牌营销指南（草稿）', content: '如何做好品牌营销...', updatedAt: '2026-06-28 10:00:00' },
]

const historyData = [
  { id: 'h1', title: '品牌营销指南', mode: 'outline' as const, content: '大纲内容...', createdAt: '2026-06-28 14:00:00' },
  { id: 'h2', title: '新品发布文案', mode: 'draft' as const, content: '初稿内容...', createdAt: '2026-06-27 10:00:00' },
]

export const articleMockApi = {
  async generate(params: ArticleGenerateParams): Promise<ApiResponse<ArticleGenerateResult>> {
    await delay(2000)
    const content = params.mode === 'outline'
      ? `【大纲】${params.title}\n\n一、引言\n二、核心观点\n三、案例分析\n四、总结与建议`
      : `【初稿】${params.title}\n\n在当今竞争激烈的市场环境中，品牌营销变得越来越重要...\n\n${params.requirements ? '要求：' + params.requirements : ''}`
    return { code: 0, message: 'success', success: true, data: { content, mode: params.mode } }
  },

  async uploadFile(file: File): Promise<ApiResponse<{ name: string; size: string }>> {
    await delay(1000)
    return { code: 0, message: 'success', success: true, data: { name: file.name, size: `${Math.round(file.size / 1024)}KB` } }
  },

  async getTemplates(): Promise<ApiResponse<ArticleTemplate[]>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: templates }
  },

  async getDrafts(): Promise<ApiResponse<ArticleDraft[]>> {
    await delay(400)
    return { code: 0, message: 'success', success: true, data: drafts }
  },

  async saveDraft(draft: Pick<ArticleDraft, 'title' | 'content'> & { id?: string }): Promise<ApiResponse<ArticleDraft>> {
    await delay(500)
    return {
      code: 0, message: 'success', success: true,
      data: { id: draft.id ?? `d${Date.now()}`, title: draft.title, content: draft.content, updatedAt: new Date().toISOString() },
    }
  },

  async getHistory(params?: ArticleHistoryQueryParams): Promise<ApiResponse<ArticleHistoryResult>> {
    await delay(500)
    const page = params?.page ?? 1
    const pageSize = params?.pageSize ?? 10
    return {
      code: 0, message: 'success', success: true,
      data: { list: historyData, total: historyData.length, page, pageSize },
    }
  },
}
