/**
 * 首页模块类型定义
 * 所有 home 相关类型统一在此定义
 */

/** 案例展示（当前 UI 使用） */
export interface CaseStudy {
  id: string
  title: string
  image: string
  description: string
}

/** 关于我们项（当前 UI 使用） */
export interface AboutItem {
  id: string
  title: string
  description: string
}

/** 功能入口卡片（当前 UI 使用） */
export interface FeatureCard {
  icon: string
  title: string
  description: string
  route: string
  delay: string
}

/** 首页统计卡片 */
export interface HomeStat {
  key: string
  label: string
  value: number
  unit?: string
  changeRate?: number
}

/** 快捷入口 */
export interface HomeShortcut {
  id: string
  title: string
  description?: string
  route: string
  icon?: string
}

/** 最近记录 */
export interface HomeRecentItem {
  id: string
  title: string
  type: string
  createdAt: string
  route?: string
}

/** 首页概览 */
export interface HomeOverview {
  stats: HomeStat[]
  shortcuts: HomeShortcut[]
  recentItems: HomeRecentItem[]
}
