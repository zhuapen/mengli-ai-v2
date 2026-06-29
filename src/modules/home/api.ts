/**
 * 首页真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { CaseStudy, AboutItem, HomeOverview, HomeRecentItem, HomeShortcut } from './types'

export const homeApi = {
  /** 获取案例列表 */
  getCaseStudies(): Promise<CaseStudy[]> {
    return api.get<CaseStudy[]>('/home/case-studies')
  },

  /** 获取关于我们 */
  getAboutItems(): Promise<AboutItem[]> {
    return api.get<AboutItem[]>('/home/about')
  },

  /** 获取首页概览 */
  getOverview(): Promise<HomeOverview> {
    return api.get<HomeOverview>('/home/overview')
  },

  /** 获取最近记录 */
  getRecentItems(): Promise<HomeRecentItem[]> {
    return api.get<HomeRecentItem[]>('/home/recent')
  },

  /** 获取快捷入口 */
  getShortcuts(): Promise<HomeShortcut[]> {
    return api.get<HomeShortcut[]>('/home/shortcuts')
  },
}
