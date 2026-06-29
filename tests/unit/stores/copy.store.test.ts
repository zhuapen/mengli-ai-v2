import { describe, it, expect, beforeEach } from 'vitest'
import { createTestPinia } from '../../utils/test-pinia'
import { useCopyStore } from '@/modules/copy/store'

describe('useCopyStore', () => {
  beforeEach(() => {
    createTestPinia()
  })

  it('初始状态正确', () => {
    const store = useCopyStore()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.output).toBe('')
    expect(store.versions).toEqual([])
    expect(store.currentVersion).toBe(0)
    expect(store.hasOutput).toBe(false)
  })

  describe('generate', () => {
    it('生成成功后 output 有值', async () => {
      const store = useCopyStore()
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '测试产品',
        extra: '',
      })
      expect(store.output.length).toBeGreaterThan(0)
      expect(store.hasOutput).toBe(true)
      expect(store.versions.length).toBe(1)
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('生成后版本号递增', async () => {
      const store = useCopyStore()
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '产品A',
        extra: '',
      })
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '产品B',
        extra: '',
      })
      expect(store.versions.length).toBe(2)
      expect(store.currentVersion).toBe(1)
    })
  })

  describe('refine', () => {
    it('优化后 output 更新', async () => {
      const store = useCopyStore()
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '测试产品',
        extra: '',
      })
      const originalOutput = store.output
      await store.refine('更口语化')
      expect(store.output).toContain('更口语化')
      expect(store.versions.length).toBe(2)
    })
  })

  describe('switchVersion', () => {
    it('切换版本后 output 更新', async () => {
      const store = useCopyStore()
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '产品A',
        extra: '',
      })
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '产品B',
        extra: '',
      })
      store.switchVersion(0)
      expect(store.currentVersion).toBe(0)
      expect(store.output).toContain('产品A')
    })
  })

  describe('clearResult', () => {
    it('清空所有结果', async () => {
      const store = useCopyStore()
      await store.generate({
        copyType: '种草科普',
        brand: '',
        product: '测试产品',
        extra: '',
      })
      store.clearResult()
      expect(store.output).toBe('')
      expect(store.versions).toEqual([])
      expect(store.currentVersion).toBe(0)
      expect(store.hasOutput).toBe(false)
    })
  })

  describe('clearError', () => {
    it('清空错误', () => {
      const store = useCopyStore()
      store.clearError()
      expect(store.error).toBeNull()
    })
  })

  describe('fetchTemplates', () => {
    it('加载模板列表', async () => {
      const store = useCopyStore()
      await store.fetchTemplates()
      expect(store.templates.length).toBeGreaterThan(0)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchBrands', () => {
    it('加载品牌列表', async () => {
      const store = useCopyStore()
      await store.fetchBrands()
      expect(store.brands.length).toBeGreaterThan(0)
      expect(store.error).toBeNull()
    })
  })
})
