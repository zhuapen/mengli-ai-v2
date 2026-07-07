import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { mediaApi } from './api'
import { mediaMockApi } from './mock'
import type {
  BriefAnalysis,
  BriefAnalysisRequest,
  CollectionTask,
  CreatorProfile,
  KOL,
  MediaProject,
  MediaSearchParams,
  PgyFilterPlan,
  ProjectResult,
  StartCollectionRequest,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

const readResponseData = <T>(value: T | { data: T }): T => {
  if (typeof value === 'object' && value !== null && 'data' in value) {
    return value.data
  }

  return value
}

const unique = (items: string[]) => Array.from(new Set(items.map(item => item.trim()).filter(Boolean)))

const briefHasAny = (brief: string, terms: string[]) => terms.some(term => brief.includes(term))

const normalizeCategoryPlan = (analysis: BriefAnalysis, brief: string): PgyFilterPlan => {
  const isFood = briefHasAny(brief, ['沃隆', '坚果', '零食', '美食', '试吃', '开箱测评'])
  const isComputer = briefHasAny(brief, ['YOGA', 'yoga', '电脑', '笔记本', '轻薄本', '国补'])
  const isMotoGift = briefHasAny(brief, ['moto', 'razr', '折叠屏', '情人节', '情侣', '礼物'])

  let allowedCategories = analysis.pgyFilterPlan.primaryCategories
  let allowedSubCategories = analysis.pgyFilterPlan.subCategories

  if (isFood) {
    allowedCategories = ['美食']
    allowedSubCategories = ['美食测评', '美食展示', '美食教程', '美食其他']
  } else if (isComputer) {
    allowedCategories = ['科技数码', '职场', '生活记录', '时尚']
    allowedSubCategories = ['移动数码', '数码测评', '电脑测评', '职场生活', '桌面搭配', '白领穿搭']
  } else if (isMotoGift) {
    allowedCategories = ['情感', '生活记录', '科技数码', '时尚']
    allowedSubCategories = ['情侣', '礼物', '好物分享', '数码测评', '高质感生活']
  }

  const categories = unique(allowedCategories)
  const subCategories = unique(allowedSubCategories)

  return {
    ...analysis.pgyFilterPlan,
    resetBeforeApply: true,
    primaryCategories: categories,
    subCategories,
    mappedFilters: analysis.pgyFilterPlan.mappedFilters.map(filter => {
      if (filter.group !== '博主类目') return filter

      return {
        ...filter,
        values: categories,
        reason: '按 brief 重新校验主类目，禁止沿用上一轮筛选条件',
      }
    }),
    validationWarnings: unique([
      ...analysis.pgyFilterPlan.validationWarnings,
      '每次采集前必须点击重置，不能继承上一轮项目的蒲公英筛选条件',
      categories.length > 0 ? `首轮只允许这些主类目：${categories.join('、')}` : '',
    ]),
  }
}

const normalizeAnalysis = (analysis: BriefAnalysis, brief: string): BriefAnalysis => {
  const pgyFilterPlan = normalizeCategoryPlan(analysis, brief)

  return {
    ...analysis,
    pgyFilterPlan,
    searchKeywords: unique(analysis.searchKeywords),
    synonymKeywords: unique(analysis.synonymKeywords),
    productKeywords: unique(analysis.productKeywords),
    creatorTypes: unique(analysis.creatorTypes),
    audienceTags: unique(analysis.audienceTags),
    excludedTags: unique(analysis.excludedTags),
    contentAngles: unique(analysis.contentAngles),
    hardRequirements: unique(analysis.hardRequirements),
    flexibleRequirements: unique(analysis.flexibleRequirements),
    questions: unique(analysis.questions.filter(question => !question.includes('发布') && !question.includes('排期') && !question.includes('链接上线'))),
  }
}

const handleError = (scope: string, fallback: string, error: unknown) => {
  const message = error instanceof Error ? error.message : fallback
  logger.error(`[MediaService] ${scope} failed`, message)
  throw new Error(message)
}

export const mediaService = {
  async getCreators(params?: MediaSearchParams): Promise<CreatorProfile[]> {
    logger.info('[MediaService] getCreators', params)
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.getCreators(params))
      }

      return await mediaApi.getCreators(params)
    } catch (error) {
      return handleError('getCreators', '获取达人失败', error)
    }
  },

  async searchKOLs(params?: MediaSearchParams): Promise<KOL[]> {
    logger.info('[MediaService] searchKOLs', params)
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.searchKOLs(params))
      }

      return await mediaApi.searchKOLs(params)
    } catch (error) {
      return handleError('searchKOLs', '搜索达人失败', error)
    }
  },

  async getProjects(): Promise<MediaProject[]> {
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.getProjects())
      }

      return await mediaApi.getProjects()
    } catch (error) {
      return handleError('getProjects', '获取项目失败', error)
    }
  },

  async analyzeBrief(request: BriefAnalysisRequest): Promise<BriefAnalysis> {
    try {
      const analysis = useMock()
        ? readResponseData(await mediaMockApi.analyzeBrief(request))
        : await mediaApi.analyzeBrief(request)

      return normalizeAnalysis(analysis, request.brief)
    } catch (error) {
      return handleError('analyzeBrief', '拆解 brief 失败', error)
    }
  },

  async startCollection(request: StartCollectionRequest): Promise<CollectionTask> {
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.startCollection(request))
      }

      return await mediaApi.startCollection(request)
    } catch (error) {
      return handleError('startCollection', '创建采集任务失败', error)
    }
  },

  async getProjectResult(projectId: string): Promise<ProjectResult> {
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.getProjectResult(projectId))
      }

      return await mediaApi.getProjectResult(projectId)
    } catch (error) {
      return handleError('getProjectResult', '获取推荐结果失败', error)
    }
  },

  async getPlatforms(): Promise<string[]> {
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.getPlatforms())
      }

      return await mediaApi.getPlatforms()
    } catch (error) {
      return handleError('getPlatforms', '获取平台失败', error)
    }
  },

  async getTags(): Promise<string[]> {
    try {
      if (useMock()) {
        return readResponseData(await mediaMockApi.getTags())
      }

      return await mediaApi.getTags()
    } catch (error) {
      return handleError('getTags', '获取标签失败', error)
    }
  },
}
