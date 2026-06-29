/**
 * 小红书文案 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { copyService } from './service'
import type { CopyGenerateParams, CopyTemplate, BrandOption, CopyHistoryItem } from './types'

export const useCopyStore = defineStore('copy', () => {
  // ===== State =====
  const loading = ref(false)
  const error = ref<string | null>(null)
  const output = ref('')
  const versions = ref<string[]>([])
  const currentVersion = ref(0)
  const templates = ref<CopyTemplate[]>([])
  const brands = ref<BrandOption[]>([])
  const history = ref<CopyHistoryItem[]>([])

  // ===== Getters =====
  const hasOutput = computed(() => output.value.length > 0)

  // ===== Actions =====

  /** 生成文案 */
  async function generate(params: CopyGenerateParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await copyService.generate(params)
      output.value = result.content
      versions.value.push(result.content)
      currentVersion.value = versions.value.length - 1
    } catch (e) {
      error.value = e instanceof Error ? e.message : '生成失败'
    } finally {
      loading.value = false
    }
  }

  /** 优化文案 */
  async function refine(instruction: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await copyService.refine({ content: output.value, instruction })
      output.value = result.content
      versions.value.push(result.content)
      currentVersion.value = versions.value.length - 1
    } catch (e) {
      error.value = e instanceof Error ? e.message : '优化失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载模板 */
  async function fetchTemplates(): Promise<void> {
    error.value = null
    try {
      templates.value = await copyService.getTemplates()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取模板失败'
    }
  }

  /** 加载品牌 */
  async function fetchBrands(): Promise<void> {
    error.value = null
    try {
      brands.value = await copyService.getBrands()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取品牌失败'
    }
  }

  /** 加载历史 */
  async function fetchHistory(): Promise<void> {
    error.value = null
    try {
      history.value = await copyService.getHistory()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取历史失败'
    }
  }

  /** 切换版本 */
  function switchVersion(index: number): void {
    currentVersion.value = index
    output.value = versions.value[index]
  }

  /** 清空结果 */
  function clearResult(): void {
    output.value = ''
    versions.value = []
    currentVersion.value = 0
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  return {
    loading,
    error,
    output,
    versions,
    currentVersion,
    templates,
    brands,
    history,
    hasOutput,
    generate,
    refine,
    fetchTemplates,
    fetchBrands,
    fetchHistory,
    switchVersion,
    clearResult,
    clearError,
  }
})
