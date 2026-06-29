import { describe, it, expect } from 'vitest'
import { copyService } from '@/modules/copy/service'

describe('copyService', () => {
  describe('generate', () => {
    it('返回文案内容和版本号', async () => {
      const result = await copyService.generate({
        copyType: '种草科普',
        brand: '',
        product: '测试产品',
        extra: '',
      })
      expect(result.content).toBeDefined()
      expect(result.content.length).toBeGreaterThan(0)
      expect(result.version).toBeGreaterThan(0)
    })

    it('包含产品名称', async () => {
      const result = await copyService.generate({
        copyType: '种草科普',
        brand: '',
        product: '超级精华液',
        extra: '',
      })
      expect(result.content).toContain('超级精华液')
    })
  })

  describe('refine', () => {
    it('返回优化后的内容', async () => {
      const result = await copyService.refine({
        content: '原始文案',
        instruction: '更口语化',
      })
      expect(result.content).toContain('原始文案')
      expect(result.content).toContain('更口语化')
    })
  })

  describe('getTemplates', () => {
    it('返回模板列表', async () => {
      const templates = await copyService.getTemplates()
      expect(Array.isArray(templates)).toBe(true)
      expect(templates.length).toBeGreaterThan(0)
      expect(templates[0]).toHaveProperty('id')
      expect(templates[0]).toHaveProperty('name')
    })
  })

  describe('getBrands', () => {
    it('返回品牌列表', async () => {
      const brands = await copyService.getBrands()
      expect(Array.isArray(brands)).toBe(true)
      expect(brands.length).toBeGreaterThan(0)
      expect(brands[0]).toHaveProperty('value')
      expect(brands[0]).toHaveProperty('label')
    })
  })

  describe('getHistory', () => {
    it('返回历史记录', async () => {
      const history = await copyService.getHistory()
      expect(Array.isArray(history)).toBe(true)
    })
  })
})
