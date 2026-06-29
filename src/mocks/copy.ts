/**
 * 小红书文案 Mock API
 */
import type { ApiResponse } from '@/core/api/types'

export interface CopyTemplate {
  id: string
  name: string
  prompt: string
  category: string
}

export interface CopyGenerateRequest {
  copyType: string
  brand: string
  product: string
  extra?: string
}

export interface CopyRefineRequest {
  content: string
  instruction: string
}

export interface CopyGenerateResponse {
  content: string
  version: number
}

const templates: CopyTemplate[] = [
  {
    id: '1',
    name: '小红书种草文案',
    prompt: '请为{product}写一篇小红书种草文案，风格活泼，突出产品亮点',
    category: '种草',
  },
  {
    id: '2',
    name: '朋友圈推广文案',
    prompt: '请为{product}写一条朋友圈推广文案，简洁有吸引力',
    category: '推广',
  },
  {
    id: '3',
    name: '产品详情页文案',
    prompt: '请为{product}写一段产品详情页文案，突出卖点和使用场景',
    category: '详情',
  },
]

const brands = [
  { value: '', label: '通用品牌' },
  { value: '听研 BIOLAB', label: '听研 BIOLAB - 科技护肤' },
  { value: '汤臣倍健', label: '汤臣倍健 - 保健品' },
  { value: '她多维', label: '她多维 - 女性维生素' },
  { value: 'SLIM蛋', label: 'SLIM蛋 - 蛋白粉' },
  { value: '臻钻蛋白粉', label: '臻钻蛋白粉 - 高端蛋白' },
  { value: '特医', label: '特医 - 特医食品' },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let versionCounter = 0

export const copyMockApi = {
  async generate(params: CopyGenerateRequest): Promise<ApiResponse<CopyGenerateResponse>> {
    await delay(1500)
    versionCounter++
    const content = `【${params.copyType}】${params.product}

姐妹们！！这款${params.product}真的太绝了！🔥

作为一个成分党，我必须说这个配方真的很良心。${params.brand ? params.brand + '出品，品质有保障。' : ''}

使用感受：
✨ 质地轻薄，吸收超快
✨ 用了一周效果明显
✨ 性价比超高，闭眼入！

#好物分享 #种草 #小红书 #${params.product}

${params.extra ? '备注：' + params.extra : ''}`

    return { code: 0, message: 'success', success: true, data: { content, version: versionCounter } }
  },

  async refine(params: CopyRefineRequest): Promise<ApiResponse<CopyGenerateResponse>> {
    await delay(1000)
    versionCounter++
    const content = params.content + `\n\n【优化】${params.instruction}...`
    return { code: 0, message: 'success', success: true, data: { content, version: versionCounter } }
  },

  async getTemplates(): Promise<ApiResponse<CopyTemplate[]>> {
    await delay(300)
    return { code: 0, message: 'success', success: true, data: templates }
  },

  async getBrands(): Promise<ApiResponse<Array<{ value: string; label: string }>>> {
    await delay(200)
    return { code: 0, message: 'success', success: true, data: brands }
  },
}
