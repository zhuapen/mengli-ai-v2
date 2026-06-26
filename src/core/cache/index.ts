// 内存缓存
const memoryCache = new Map<string, { data: any; expire: number }>()

export const cache = {
  // ===== 内存缓存 =====
  setMemory(key: string, data: any, ttl = 60000) {
    memoryCache.set(key, { data, expire: Date.now() + ttl })
  },

  getMemory<T = any>(key: string): T | null {
    const item = memoryCache.get(key)
    if (!item || Date.now() > item.expire) {
      memoryCache.delete(key)
      return null
    }
    return item.data as T
  },

  removeMemory(key: string) {
    memoryCache.delete(key)
  },

  clearMemory() {
    memoryCache.clear()
  },

  // ===== Session 缓存 =====
  setSession(key: string, data: any) {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to set session storage:', e)
    }
  },

  getSession<T = any>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  removeSession(key: string) {
    sessionStorage.removeItem(key)
  },

  // ===== Local 缓存 =====
  setLocal(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to set local storage:', e)
    }
  },

  getLocal<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  removeLocal(key: string) {
    localStorage.removeItem(key)
  },
}

export default cache
