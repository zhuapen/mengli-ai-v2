/**
 * 测试用 Pinia 工具
 * 提供统一的测试 Pinia 实例
 */
import { createPinia, setActivePinia } from 'pinia'

/** 创建并激活测试 Pinia 实例 */
export function createTestPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return pinia
}
