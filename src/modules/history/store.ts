/**
 * 历史记录 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { historyService } from './service'
import type { HistoryItem, HistoryTabType } from './types'

export const useHistoryStore = defineStore('history', () => {
  // ===== State =====
  const loading = ref(false)
  const clearing = ref(false)
  const error = ref<string | null>(null)
  const items = ref<HistoryItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const activeTab = ref<HistoryTabType>('all')
  const keyword = ref('')

  // ===== Getters =====
  const filteredItems = computed(() => {
    if (activeTab.value === 'all') return items.value
    return items.value.filter((item) => item.type === activeTab.value)
  })

  // ===== Actions =====

  /** 加载历史列表 */
  async function fetchList(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await historyService.getList({
        page: page.value,
        pageSize: pageSize.value,
        type: activeTab.value === 'all' ? undefined : activeTab.value,
        keyword: keyword.value || undefined,
      })
      items.value = result.list
      total.value = result.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取历史失败'
    } finally {
      loading.value = false
    }
  }

  /** 删除单条历史 */
  async function remove(id: string): Promise<void> {
    error.value = null
    try {
      await historyService.remove(id)
      items.value = items.value.filter((item) => item.id !== id)
      total.value--
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除失败'
    }
  }

  /** 清空全部历史 */
  async function clear(): Promise<void> {
    clearing.value = true
    error.value = null
    try {
      await historyService.clear()
      items.value = []
      total.value = 0
    } catch (e) {
      error.value = e instanceof Error ? e.message : '清空失败'
    } finally {
      clearing.value = false
    }
  }

  /** 设置筛选类型 */
  function setTab(tab: HistoryTabType): void {
    activeTab.value = tab
    fetchList()
  }

  /** 设置搜索关键词 */
  function setKeyword(kw: string): void {
    keyword.value = kw
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  /** 初始化 */
  async function init(): Promise<void> {
    await fetchList()
  }

  return {
    loading,
    clearing,
    error,
    items,
    total,
    page,
    pageSize,
    activeTab,
    keyword,
    filteredItems,
    fetchList,
    remove,
    clear,
    setTab,
    setKeyword,
    clearError,
    init,
  }
})
