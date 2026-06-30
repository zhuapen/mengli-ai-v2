/**
 * 媒体库模块类型定义
 */

export interface KOL {
  id: string
  name: string
  platform: string
  avatar: string
  followers: number
  engagement: number
  tags: string[]
  price: number
}

export interface MediaSearchParams {
  keyword?: string
  platform?: string
  tags?: string[]
}
