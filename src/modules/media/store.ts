/**
 * 媒体库 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mediaService } from './service'
import type { KOL, MediaSearchParams } from './types'

export const useMediaStore = defineStore('media', () => {
  // ===== State =====
  const loading = ref(false)
  const error = ref<string | null>(null)
  const kolList = ref<KOL[]>([])
  const platforms = ref<string[]>([])
  const tags = ref<string[]>([])
  const selectedPlatform = ref('全部')
  const selectedTags = ref<string[]>([])
  const keyword = ref('')

  // ===== Getters =====
  const filteredList = computed(() => {
    let result = [...kolList.value]
    if (selectedPlatform.value && selectedPlatform.value !== '全部') {
      result = result.filter((kol) => kol.platform === selectedPlatform.value)
    }
    if (selectedTags.value.length > 0) {
      result = result.filter((kol) =>
        selectedTags.value.some((tag) => kol.tags.includes(tag)),
      )
    }
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      result = result.filter((kol) => kol.name.toLowerCase().includes(kw))
    }
    return result
  })

  // ===== Actions =====
  async function searchKOLs(params?: MediaSearchParams): Promise<void> {
    loading.value = true
    error.value = null
    try {
      kolList.value = await mediaService.searchKOLs(params)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '搜索失败'
    } finally {
      loading.value = false
    }
  }

  async function loadPlatforms(): Promise<void> {
    error.value = null
    try {
      platforms.value = await mediaService.getPlatforms()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取平台失败'
    }
  }

  async function loadTags(): Promise<void> {
    error.value = null
    try {
      tags.value = await mediaService.getTags()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取标签失败'
    }
  }

  function setPlatform(platform: string): void {
    selectedPlatform.value = platform
  }

  function toggleTag(tag: string): void {
    const idx = selectedTags.value.indexOf(tag)
    if (idx >= 0) {
      selectedTags.value.splice(idx, 1)
    } else {
      selectedTags.value.push(tag)
    }
  }

  function clearError(): void {
    error.value = null
  }

  async function init(): Promise<void> {
    await Promise.all([searchKOLs(), loadPlatforms(), loadTags()])
  }

  return {
    loading,
    error,
    kolList,
    platforms,
    tags,
    selectedPlatform,
    selectedTags,
    keyword,
    filteredList,
    searchKOLs,
    loadPlatforms,
    loadTags,
    setPlatform,
    toggleTag,
    clearError,
    init,
  }
})
