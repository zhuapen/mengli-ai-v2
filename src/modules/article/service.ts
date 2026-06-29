/**
 * 公众号写稿 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { articleApi } from './api'
import { articleMockApi } from './mock'
import type {
  ArticleGenerateParams,
  ArticleGenerateResult,
  ArticleTemplate,
  ArticleDraft,
  ArticleHistoryQueryParams,
  ArticleHistoryResult,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const articleService = {
  async generate(params: ArticleGenerateParams): Promise<ArticleGenerateResult> {
    logger.info('[ArticleService] generate', { title: params.title, mode: params.mode })
    try {
      if (useMock()) {
        const res = await articleMockApi.generate(params)
        return res.data
      }
      return await articleApi.generate(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文章生成失败'
      logger.error('[ArticleService] generate failed', msg)
      throw new Error(msg)
    }
  },

  async uploadFile(file: File): Promise<{ name: string; size: string }> {
    logger.info('[ArticleService] uploadFile', { name: file.name })
    try {
      if (useMock()) {
        const res = await articleMockApi.uploadFile(file)
        return res.data
      }
      return await articleApi.uploadFile(file)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '文件上传失败'
      logger.error('[ArticleService] uploadFile failed', msg)
      throw new Error(msg)
    }
  },

  async getTemplates(): Promise<ArticleTemplate[]> {
    logger.info('[ArticleService] getTemplates')
    try {
      if (useMock()) {
        const res = await articleMockApi.getTemplates()
        return res.data
      }
      return await articleApi.getTemplates()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取模板失败'
      logger.error('[ArticleService] getTemplates failed', msg)
      throw new Error(msg)
    }
  },

  async getDrafts(): Promise<ArticleDraft[]> {
    logger.info('[ArticleService] getDrafts')
    try {
      if (useMock()) {
        const res = await articleMockApi.getDrafts()
        return res.data
      }
      return await articleApi.getDrafts()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取草稿失败'
      logger.error('[ArticleService] getDrafts failed', msg)
      throw new Error(msg)
    }
  },

  async saveDraft(draft: Pick<ArticleDraft, 'title' | 'content'> & { id?: string }): Promise<ArticleDraft> {
    logger.info('[ArticleService] saveDraft', { title: draft.title })
    try {
      if (useMock()) {
        const res = await articleMockApi.saveDraft(draft)
        return res.data
      }
      return await articleApi.saveDraft(draft)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '保存草稿失败'
      logger.error('[ArticleService] saveDraft failed', msg)
      throw new Error(msg)
    }
  },

  async getHistory(params?: ArticleHistoryQueryParams): Promise<ArticleHistoryResult> {
    logger.info('[ArticleService] getHistory', params)
    try {
      if (useMock()) {
        const res = await articleMockApi.getHistory(params)
        return res.data
      }
      return await articleApi.getHistory(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取历史失败'
      logger.error('[ArticleService] getHistory failed', msg)
      throw new Error(msg)
    }
  },
}
