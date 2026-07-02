/**
 * 小红书文案真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type {
  CopyGenerateParams,
  CopyGenerateResult,
  CopyRefineParams,
  CopyTemplate,
  BrandOption,
  CopyHistoryItem,
} from './types'

/** AI 生成接口超时时间（120秒），AI 生成耗时较长 */
const AI_GENERATION_TIMEOUT = 120_000

export const copyApi = {
  /** 生成文案 */
  generate(params: CopyGenerateParams): Promise<CopyGenerateResult> {
    return api.post<CopyGenerateResult>('/copy/generate', params, {
      timeout: AI_GENERATION_TIMEOUT,
    })
  },

  /** 优化文案 */
  refine(params: CopyRefineParams): Promise<CopyGenerateResult> {
    return api.post<CopyGenerateResult>('/copy/refine', params, {
      timeout: AI_GENERATION_TIMEOUT,
    })
  },

  /** 获取模板列表 */
  getTemplates(): Promise<CopyTemplate[]> {
    return api.get<CopyTemplate[]>('/copy/templates')
  },

  /** 获取品牌列表 */
  getBrands(): Promise<BrandOption[]> {
    return api.get<BrandOption[]>('/copy/brands')
  },

  /** 获取生成历史 */
  getHistory(): Promise<CopyHistoryItem[]> {
    return api.get<CopyHistoryItem[]>('/copy/history')
  },
}
