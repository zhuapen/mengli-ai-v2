import { ref, type Ref } from 'vue'
import { logger } from '@/core/logger'

export interface UseRequestOptions<T> {
  /** 立即执行 */
  immediate?: boolean
  /** 默认值 */
  defaultValue?: T
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

export interface UseRequestReturn<T> {
  /** 数据 */
  data: Ref<T | null>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误 */
  error: Ref<Error | null>
  /** 执行请求 */
  execute: (...args: any[]) => Promise<T | null>
  /** 重试 */
  retry: () => Promise<T | null>
}

export function useRequest<T>(
  fn: (...args: any[]) => Promise<T>,
  options: UseRequestOptions<T> = {},
): UseRequestReturn<T> {
  const { immediate = false, defaultValue = null, onSuccess, onError } = options

  const data = ref<T | null>(defaultValue ?? null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let lastArgs: any[] = []

  async function execute(...args: any[]): Promise<T | null> {
    lastArgs = args
    loading.value = true
    error.value = null

    try {
      const result = await fn(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      logger.captureException(err)
      onError?.(err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function retry(): Promise<T | null> {
    return execute(...lastArgs)
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
    retry,
  }
}

export default useRequest
