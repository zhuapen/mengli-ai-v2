/**
 * 插件中心 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pluginService } from './service'
import type { PluginItem, PluginCategory } from './types'

export const usePluginStore = defineStore('plugin', () => {
  // ===== State =====
  const loading = ref(false)
  const operating = ref(false)
  const error = ref<string | null>(null)
  const plugins = ref<PluginItem[]>([])
  const categories = ref<PluginCategory[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const selectedCategoryId = ref<string>('all')
  const keyword = ref('')

  // ===== Actions =====

  /** 加载插件列表 */
  async function fetchList(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await pluginService.getList({
        page: page.value,
        pageSize: pageSize.value,
        categoryId: selectedCategoryId.value === 'all' ? undefined : selectedCategoryId.value,
        keyword: keyword.value || undefined,
      })
      plugins.value = result.list
      total.value = result.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取插件失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载分类 */
  async function fetchCategories(): Promise<void> {
    error.value = null
    try {
      categories.value = await pluginService.getCategories()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取分类失败'
    }
  }

  /** 启用插件 */
  async function enable(id: string): Promise<void> {
    operating.value = true
    error.value = null
    try {
      await pluginService.enable(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '启用失败'
    } finally {
      operating.value = false
    }
  }

  /** 禁用插件 */
  async function disable(id: string): Promise<void> {
    operating.value = true
    error.value = null
    try {
      await pluginService.disable(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '禁用失败'
    } finally {
      operating.value = false
    }
  }

  /** 切换启用/禁用 */
  async function toggle(id: string, currentEnabled: boolean): Promise<void> {
    if (currentEnabled) {
      await disable(id)
    } else {
      await enable(id)
    }
  }

  /** 设置搜索关键词 */
  function setKeyword(kw: string): void {
    keyword.value = kw
  }

  /** 设置分类 */
  function setCategory(categoryId: string): void {
    selectedCategoryId.value = categoryId
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  /** 初始化 */
  async function init(): Promise<void> {
    await Promise.all([fetchList(), fetchCategories()])
  }

  return {
    loading,
    operating,
    error,
    plugins,
    categories,
    total,
    page,
    pageSize,
    selectedCategoryId,
    keyword,
    fetchList,
    fetchCategories,
    enable,
    disable,
    toggle,
    setKeyword,
    setCategory,
    clearError,
    init,
  }
})
