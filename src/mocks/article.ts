/**
 * 公众号写稿 Mock API
 */
import type { ApiResponse } from '@/core/api/types'

export interface ArticleTemplate {
  id: string
  name: string
  description: string
}

export interface ArticleGenerateRequest {
  title: string
  mode: 'outline' | 'draft'
  requirements?: string
  file?: { name: string; size: string }
}

export interface ArticleGenerateResponse {
  content: string
  mode: 'outline' | 'draft'
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const templates: ArticleTemplate[] = [
  { id: '1', name: '产品评测', description: '详细的产品使用体验和评测文章' },
  { id: '2', name: '行业分析', description: '深度行业分析和趋势解读' },
  { id: '3', name: '教程指南', description: '实用的操作教程和指南' },
]

export const articleMockApi = {
  async generate(params: ArticleGenerateRequest): Promise<ApiResponse<ArticleGenerateResponse>> {
    await delay(2000)
    const content =
      params.mode === 'outline'
        ? `【大纲】${params.title}\n\n一、引言\n二、核心观点\n三、案例分析\n四、总结与建议`
        : `【初稿】${params.title}\n\n在当今竞争激烈的市场环境中，品牌营销变得越来越重要...\n\n${params.requirements ? '要求：' + params.requirements : ''}`

    return { code: 0, message: 'success', success: true, data: { content, mode: params.mode } }
  },

  async uploadFile(file: File): Promise<ApiResponse<{ name: string; size: string }>> {
    await delay(1000)
    return {
      code: 0,
      message: 'success',
      data: { name: file.name, size: `${Math.round(file.size / 1024)}KB` },
    }
  },

  async getTemplates(): Promise<ApiResponse<ArticleTemplate[]>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: templates }
  },
}
