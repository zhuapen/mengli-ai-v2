/**
 * 素材库 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { assetsService } from './service'
import type { AssetItem, CreateAssetParams } from './types'

export const useAssetsStore = defineStore('assets', () => {
  // ===== State =====
  const loading = ref(false)
  const creating = ref(false)
  const error = ref<string | null>(null)
  const items = ref<AssetItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const activeTab = ref<string>('all')
  const keyword = ref('')

  // ===== Getters =====
  const filteredItems = computed(() => {
    if (activeTab.value === 'all') return items.value
    return items.value.filter((item) => item.type === activeTab.value)
  })

  // ===== Actions =====

  /** 加载素材列表 */
  async function fetchList(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await assetsService.getList({
        page: page.value,
        pageSize: pageSize.value,
        type: activeTab.value === 'all' ? undefined : activeTab.value,
        keyword: keyword.value || undefined,
      })
      items.value = result.list
      total.value = result.total
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取素材失败'
    } finally {
      loading.value = false
    }
  }

  /** 创建素材 */
  async function create(params: CreateAssetParams): Promise<void> {
    creating.value = true
    error.value = null
    try {
      const item = await assetsService.create(params)
      items.value.unshift(item)
      total.value++
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建素材失败'
    } finally {
      creating.value = false
    }
  }

  /** 删除素材 */
  async function remove(id: string): Promise<void> {
    error.value = null
    try {
      await assetsService.remove(id)
      items.value = items.value.filter((item) => item.id !== id)
      total.value--
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除素材失败'
    }
  }

  /** 设置筛选类型 */
  function setTab(tab: string): void {
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
    creating,
    error,
    items,
    total,
    page,
    pageSize,
    activeTab,
    keyword,
    filteredItems,
    fetchList,
    create,
    remove,
    setTab,
    setKeyword,
    clearError,
    init,
  }
})
