import { describe, it, expect, beforeEach } from 'vitest'
import { createTestPinia } from '../../utils/test-pinia'
import { useImageStore } from '@/modules/image/store'

describe('useImageStore', () => {
  beforeEach(() => {
    createTestPinia()
  })

  it('初始状态正确', () => {
    const store = useImageStore()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.outputUrl).toBe('')
    expect(store.taskId).toBe('')
    expect(store.hasOutput).toBe(false)
  })

  describe('generate', () => {
    it('生成成功后 outputUrl 和 taskId 有值', async () => {
      const store = useImageStore()
      await store.generate({
        prompt: '一只可爱的猫',
        size: '1024x1024',
        style: 'realistic',
      })
      expect(store.outputUrl.length).toBeGreaterThan(0)
      expect(store.taskId.length).toBeGreaterThan(0)
      expect(store.hasOutput).toBe(true)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('生成后 URL 包含尺寸信息', async () => {
      const store = useImageStore()
      await store.generate({
        prompt: '测试图片',
        size: '1792x1024',
        style: 'realistic',
      })
      expect(store.outputUrl).toContain('1792')
      expect(store.outputUrl).toContain('1024')
    })
  })

  describe('clearResult', () => {
    it('清空输出', async () => {
      const store = useImageStore()
      await store.generate({
        prompt: '测试',
        size: '1024x1024',
        style: 'realistic',
      })
      store.clearResult()
      expect(store.outputUrl).toBe('')
      expect(store.taskId).toBe('')
      expect(store.hasOutput).toBe(false)
    })
  })

  describe('clearError', () => {
    it('清空错误', () => {
      const store = useImageStore()
      store.clearError()
      expect(store.error).toBeNull()
    })
  })

  describe('fetchStyles', () => {
    it('加载风格列表', async () => {
      const store = useImageStore()
      await store.fetchStyles()
      expect(store.styles.length).toBeGreaterThan(0)
      expect(store.error).toBeNull()
    })
  })
})
