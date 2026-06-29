/**
 * 页面状态组合式工具
 * 统一判断 Loading / Error / Empty 状态
 */
import { computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface PageStateOptions<T> {
  loading: Ref<boolean>
  error: Ref<string | null>
  data: Ref<T[] | null | undefined>
}

export interface PageStateReturn {
  /** 首次加载中（loading=true 且无数据） */
  isInitialLoading: ComputedRef<boolean>
  /** 数据为空（非 loading、无 error、数组为空） */
  isEmpty: ComputedRef<boolean>
  /** 有错误 */
  hasError: ComputedRef<boolean>
}

export function usePageState<T>(options: PageStateOptions<T>): PageStateReturn {
  const isInitialLoading = computed(
    () => options.loading.value && (!options.data.value || options.data.value.length === 0),
  )

  const isEmpty = computed(
    () =>
      !options.loading.value &&
      !options.error.value &&
      Array.isArray(options.data.value) &&
      options.data.value.length === 0,
  )

  const hasError = computed(() => Boolean(options.error.value))

  return { isInitialLoading, isEmpty, hasError }
}
