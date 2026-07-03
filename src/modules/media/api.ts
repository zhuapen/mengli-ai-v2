/**
 * 媒体库真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { KOL, MediaSearchParams } from './types'

export const mediaApi = {
  searchKOLs(params?: MediaSearchParams) {
    return api.get<KOL[]>('/media/kols', { params })
  },

  getPlatforms() {
    return api.get<string[]>('/media/platforms')
  },

  getTags() {
    return api.get<string[]>('/media/tags')
  },
}
