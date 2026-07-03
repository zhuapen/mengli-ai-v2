/**
 * 公众号写稿真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type {
  ArticleGenerateParams,
  ArticleGenerateResult,
  ArticleTemplate,
  ArticleDraft,
  ArticleHistoryQueryParams,
  ArticleHistoryResult,
} from './types'

/** AI 生成接口超时时间（120秒），AI 生成耗时较长 */
const AI_GENERATION_TIMEOUT = 120_000

export const articleApi = {
  /** 生成文章 */
  generate(params: ArticleGenerateParams): Promise<ArticleGenerateResult> {
    return api.post<ArticleGenerateResult>('/article/generate', params, {
      timeout: AI_GENERATION_TIMEOUT,
    })
  },

  /** 上传文件 */
  uploadFile(file: File): Promise<{ name: string; size: string }> {
    return api.upload<{ name: string; size: string }>('/article/upload', file)
  },

  /** 获取模板列表 */
  getTemplates(): Promise<ArticleTemplate[]> {
    return api.get<ArticleTemplate[]>('/article/templates')
  },

  /** 获取草稿列表 */
  getDrafts(): Promise<ArticleDraft[]> {
    return api.get<ArticleDraft[]>('/article/drafts')
  },

  /** 保存草稿 */
  saveDraft(draft: Pick<ArticleDraft, 'title' | 'content'> & { id?: string }): Promise<ArticleDraft> {
    return api.post<ArticleDraft>('/article/drafts', draft)
  },

  /** 获取历史记录 */
  getHistory(params?: ArticleHistoryQueryParams): Promise<ArticleHistoryResult> {
    return api.get<ArticleHistoryResult>('/article/history', { params })
  },
}
