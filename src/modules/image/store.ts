/**
 * AI 图片 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { imageService } from './service'
import type { ImageGenerateParams, ImageStyle, ImageHistoryItem } from './types'

export const useImageStore = defineStore('image', () => {
  // ===== State =====
  const loading = ref(false)
  const error = ref<string | null>(null)
  const outputUrl = ref('')
  const taskId = ref('')
  const styles = ref<ImageStyle[]>([])
  const history = ref<ImageHistoryItem[]>([])

  // ===== Getters =====
  const hasOutput = computed(() => outputUrl.value.length > 0)

  // ===== Actions =====

  /** 生成图片 */
  async function generate(params: ImageGenerateParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await imageService.generate(params)
      outputUrl.value = result.url
      taskId.value = result.taskId
    } catch (e) {
      error.value = e instanceof Error ? e.message : '生成失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载风格列表 */
  async function fetchStyles(): Promise<void> {
    error.value = null
    try {
      styles.value = await imageService.getStyles()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取风格失败'
    }
  }

  /** 加载生成历史 */
  async function fetchHistory(): Promise<void> {
    error.value = null
    try {
      history.value = await imageService.getHistory()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取历史失败'
    }
  }

  /** 清空结果 */
  function clearResult(): void {
    outputUrl.value = ''
    taskId.value = ''
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  return {
    loading,
    error,
    outputUrl,
    taskId,
    styles,
    history,
    hasOutput,
    generate,
    fetchStyles,
    fetchHistory,
    clearResult,
    clearError,
  }
})
