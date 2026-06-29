/**
 * 公众号写稿 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleService } from './service'
import type { ArticleGenerateParams, ArticleTemplate, ArticleDraft, ArticleHistoryItem } from './types'

export const useArticleStore = defineStore('article', () => {
  // ===== State =====
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)
  const output = ref('')
  const mode = ref<'outline' | 'draft'>('outline')
  const uploadedFile = ref<{ name: string; size: string } | null>(null)
  const templates = ref<ArticleTemplate[]>([])
  const drafts = ref<ArticleDraft[]>([])
  const history = ref<ArticleHistoryItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const keyword = ref('')

  // ===== Actions =====

  /** 生成文章 */
  async function generate(params: ArticleGenerateParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await articleService.generate(params)
      output.value = result.content
      mode.value = result.mode
    } catch (e) {
      error.value = e instanceof Error ? e.message : '生成失败'
    } finally {
      loading.value = false
    }
  }

  /** 上传文件 */
  async function uploadFile(file: File): Promise<void> {
    loading.value = true
    error.value = null
    try {
      uploadedFile.value = await articleService.uploadFile(file)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '上传失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载模板 */
  async function fetchTemplates(): Promise<void> {
    error.value = null
    try {
      templates.value = await articleService.getTemplates()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取模板失败'
    }
  }

  /** 加载草稿 */
  async function fetchDrafts(): Promise<void> {
    error.value = null
    try {
      drafts.value = await articleService.getDrafts()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取草稿失败'
    }
  }

  /** 保存草稿 */
  async function saveDraft(draft: Pick<ArticleDraft, 'title' | 'content'> & { id?: string }): Promise<void> {
    saving.value = true
    error.value = null
    try {
      const saved = await articleService.saveDraft(draft)
      const idx = drafts.value.findIndex((d) => d.id === saved.id)
      if (idx >= 0) {
        drafts.value[idx] = saved
      } else {
        drafts.value.unshift(saved)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存失败'
    } finally {
      saving.value = false
    }
  }

  /** 加载历史 */
  async function fetchHistory(): Promise<void> {
    error.value = null
    try {
      const result = await articleService.getHistory({ page: page.value, pageSize: pageSize.value, keyword: keyword.value || undefined })
      history.value = result.list
      total.value = result.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取历史失败'
    }
  }

  /** 设置搜索关键词 */
  function setKeyword(kw: string): void {
    keyword.value = kw
  }

  /** 清空文章结果 */
  function clearArticle(): void {
    output.value = ''
    uploadedFile.value = null
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  return {
    loading,
    saving,
    error,
    output,
    mode,
    uploadedFile,
    templates,
    drafts,
    history,
    total,
    page,
    pageSize,
    keyword,
    generate,
    uploadFile,
    fetchTemplates,
    fetchDrafts,
    saveDraft,
    fetchHistory,
    setKeyword,
    clearArticle,
    clearError,
  }
})
