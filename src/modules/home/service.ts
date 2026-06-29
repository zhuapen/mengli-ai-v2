/**
 * 首页 Service
 * 业务编排 + Mock/API 自动切换 + 错误转换 + 日志
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { homeApi } from './api'
import { homeMockApi } from './mock'
import type { CaseStudy, AboutItem, HomeOverview, HomeRecentItem, HomeShortcut } from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const homeService = {
  async getCaseStudies(): Promise<CaseStudy[]> {
    logger.info('[HomeService] getCaseStudies')
    try {
      if (useMock()) {
        const res = await homeMockApi.getCaseStudies()
        return res.data
      }
      return await homeApi.getCaseStudies()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取案例失败'
      logger.error('[HomeService] getCaseStudies failed', msg)
      throw new Error(msg)
    }
  },

  async getAboutItems(): Promise<AboutItem[]> {
    logger.info('[HomeService] getAboutItems')
    try {
      if (useMock()) {
        const res = await homeMockApi.getAboutItems()
        return res.data
      }
      return await homeApi.getAboutItems()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取关于我们失败'
      logger.error('[HomeService] getAboutItems failed', msg)
      throw new Error(msg)
    }
  },

  async getOverview(): Promise<HomeOverview> {
    logger.info('[HomeService] getOverview')
    try {
      if (useMock()) {
        const res = await homeMockApi.getOverview()
        return res.data
      }
      return await homeApi.getOverview()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取概览失败'
      logger.error('[HomeService] getOverview failed', msg)
      throw new Error(msg)
    }
  },

  async getRecentItems(): Promise<HomeRecentItem[]> {
    logger.info('[HomeService] getRecentItems')
    try {
      if (useMock()) {
        const res = await homeMockApi.getRecentItems()
        return res.data
      }
      return await homeApi.getRecentItems()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取最近记录失败'
      logger.error('[HomeService] getRecentItems failed', msg)
      throw new Error(msg)
    }
  },

  async getShortcuts(): Promise<HomeShortcut[]> {
    logger.info('[HomeService] getShortcuts')
    try {
      if (useMock()) {
        const res = await homeMockApi.getShortcuts()
        return res.data
      }
      return await homeApi.getShortcuts()
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取快捷入口失败'
      logger.error('[HomeService] getShortcuts failed', msg)
      throw new Error(msg)
    }
  },
}
