/**
 * Vitest 全局 setup
 * 确保 jsdom 环境下 localStorage 正常工作
 */
import { beforeEach } from 'vitest'

// 确保 localStorage 存在且可用
if (typeof localStorage === 'undefined' || typeof localStorage.removeItem !== 'function') {
  const store = new Map<string, string>()
  ;(globalThis as Record<string, unknown>).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  }
}

// 确保 sessionStorage 存在且可用
if (typeof sessionStorage === 'undefined' || typeof sessionStorage.removeItem !== 'function') {
  const store = new Map<string, string>()
  ;(globalThis as Record<string, unknown>).sessionStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  }
}
