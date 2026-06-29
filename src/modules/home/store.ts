/**
 * 首页 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { homeService } from './service'
import type { CaseStudy, AboutItem, HomeStat, HomeShortcut, HomeRecentItem } from './types'

export const useHomeStore = defineStore('home', () => {
  // ===== State =====
  const loading = ref(false)
  const error = ref<string | null>(null)
  const caseStudies = ref<CaseStudy[]>([])
  const aboutItems = ref<AboutItem[]>([])
  const stats = ref<HomeStat[]>([])
  const shortcuts = ref<HomeShortcut[]>([])
  const recentItems = ref<HomeRecentItem[]>([])

  // ===== Actions =====

  /** 加载案例 */
  async function fetchCaseStudies(): Promise<void> {
    error.value = null
    try {
      caseStudies.value = await homeService.getCaseStudies()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取案例失败'
    }
  }

  /** 加载关于我们 */
  async function fetchAboutItems(): Promise<void> {
    error.value = null
    try {
      aboutItems.value = await homeService.getAboutItems()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取关于我们失败'
    }
  }

  /** 加载概览数据 */
  async function fetchOverview(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const overview = await homeService.getOverview()
      stats.value = overview.stats
      shortcuts.value = overview.shortcuts
      recentItems.value = overview.recentItems
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取概览失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载最近记录 */
  async function fetchRecentItems(): Promise<void> {
    error.value = null
    try {
      recentItems.value = await homeService.getRecentItems()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取最近记录失败'
    }
  }

  /** 加载快捷入口 */
  async function fetchShortcuts(): Promise<void> {
    error.value = null
    try {
      shortcuts.value = await homeService.getShortcuts()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取快捷入口失败'
    }
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  /** 初始化 */
  async function init(): Promise<void> {
    await Promise.all([fetchCaseStudies(), fetchAboutItems()])
  }

  return {
    loading,
    error,
    caseStudies,
    aboutItems,
    stats,
    shortcuts,
    recentItems,
    fetchCaseStudies,
    fetchAboutItems,
    fetchOverview,
    fetchRecentItems,
    fetchShortcuts,
    clearError,
    init,
  }
})
