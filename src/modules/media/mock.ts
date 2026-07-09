import type {
  ApiResponse,
  BriefAnalysis,
  BriefAnalysisRequest,
  CollectionTask,
  CreateProjectRequest,
  CreatorProfile,
  KOL,
  MediaProject,
  MediaSearchParams,
  ProjectResult,
  StartCollectionRequest,
} from './types'

const delay = (ms = 240) => new Promise(resolve => window.setTimeout(resolve, ms))

const now = '2026-07-07'

const creators: CreatorProfile[] = [
  {
    id: 'creator-001',
    nickname: '吃货赵圆圆',
    xhsId: '107722235',
    platform: '小红书蒲公英',
    pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/107722235',
    followers: 166000,
    imageQuote: 9000,
    videoQuote: 9000,
    rebatePercent: 20,
    contact: '媒介已登记',
    tags: ['美食', '美食测评', '测评', '低脂低卡', '开箱'],
    audienceTags: ['上班族', '女性'],
    titlesCollected: 50,
    titleStatus: 'collected',
    metricStatus: 'official',
    metrics: {
      exposureMedian: 453771,
      readMedian: 81610,
      interactionMedian: 1344,
      estimatedCpm: 6.6,
      estimatedReadUnitPrice: 0.11,
      estimatedInteractionUnitPrice: 2.23,
      collectedAt: now,
    },
    quoteUpdatedAt: now,
    dataUpdatedAt: now,
    sourceProject: '沃隆 选号项目',
    entryStatus: '正式入库',
    selectedByClient: true,
    updatedAt: now,
  },
  {
    id: 'creator-002',
    nickname: '晶大王',
    xhsId: '6943957028',
    platform: '小红书蒲公英',
    pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/6943957028',
    followers: 349000,
    imageQuote: 8800,
    videoQuote: 8800,
    tags: ['美食', '美食测评', '测评', '职场生活'],
    audienceTags: ['上班族', '男性'],
    titlesCollected: 44,
    titleStatus: 'collected',
    metricStatus: 'official',
    metrics: {
      exposureMedian: 401450,
      readMedian: 72785,
      interactionMedian: 2753,
      estimatedCpm: 21.9,
      estimatedReadUnitPrice: 0.12,
      estimatedInteractionUnitPrice: 3.2,
      collectedAt: now,
    },
    quoteUpdatedAt: now,
    dataUpdatedAt: now,
    sourceProject: '沃隆 选号项目',
    entryStatus: '候选库',
    updatedAt: now,
  },
  {
    id: 'creator-003',
    nickname: '阿顺麻麻（二胎版）',
    xhsId: 'v_Shun07666',
    platform: '小红书蒲公英',
    pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/v_Shun07666',
    followers: 47000,
    imageQuote: 6800,
    videoQuote: 7900,
    rebatePercent: 18,
    contact: '媒介已登记',
    tags: ['母婴', '婴童食品', '教程', '测评'],
    audienceTags: ['精致妈妈'],
    titlesCollected: 50,
    titleStatus: 'collected',
    metricStatus: 'official',
    metrics: {
      exposureMedian: 127580,
      readMedian: 11980,
      interactionMedian: 1299,
      estimatedCpm: 53.4,
      estimatedReadUnitPrice: 0.57,
      estimatedInteractionUnitPrice: 5.25,
      collectedAt: now,
    },
    quoteUpdatedAt: now,
    dataUpdatedAt: now,
    sourceProject: '沃隆 选号项目',
    entryStatus: '正式入库',
    updatedAt: now,
  },
  {
    id: 'creator-004',
    nickname: '是谢瓜瓜',
    xhsId: 'holly1111',
    platform: '小红书蒲公英',
    pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/holly1111',
    followers: 277000,
    imageQuote: 42800,
    videoQuote: 58800,
    tags: ['摄影', '氛围感', '教程'],
    audienceTags: ['都市青年'],
    titlesCollected: 24,
    titleStatus: 'partial',
    titleError: '标题不足 24/30，需要继续翻页补采',
    metricStatus: 'official',
    metrics: {
      exposureMedian: 65462,
      readMedian: 10105,
      interactionMedian: 736,
      estimatedCpm: 654,
      estimatedReadUnitPrice: 9.61,
      estimatedInteractionUnitPrice: 58.15,
      collectedAt: '2026-07-02',
    },
    quoteUpdatedAt: '2026-07-02',
    dataUpdatedAt: '2026-07-02',
    sourceProject: 'YOGA电脑 选号项目',
    entryStatus: '候选库',
    updatedAt: '2026-07-02',
  },
  {
    id: 'creator-005',
    nickname: '小暖历险记',
    xhsId: 'fz2003',
    platform: '小红书蒲公英',
    pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/fz2003',
    followers: 78000,
    imageQuote: 6300,
    videoQuote: 8500,
    tags: ['生活记录', '开箱', '好物分享'],
    audienceTags: ['学生党'],
    titlesCollected: 50,
    titleStatus: 'collected',
    metricStatus: 'official_unavailable',
    metricError: '官网暂无合作数据，蒲公英页面显示为空',
    metrics: {
      collectedAt: '2026-07-03',
    },
    quoteUpdatedAt: '2026-07-03',
    dataUpdatedAt: '2026-07-03',
    sourceProject: 'YOGA电脑 选号项目',
    entryStatus: '候选库',
    updatedAt: '2026-07-03',
  },
]

const projects: MediaProject[] = [
  {
    id: 'project-wolong',
    name: '沃隆 选号项目',
    brand: '沃隆',
    targetCount: 25,
    platforms: ['小红书蒲公英'],
    budgetMin: 5000,
    budgetMax: 10000,
    status: 'ready',
    brief: '美食种草、美食开箱测评，覆盖上班族、学生党、养生党、精致妈妈，CPM<70，CPE<8。',
    createdAt: '2026-07-01',
    updatedAt: now,
  },
  {
    id: 'project-moto',
    name: '联想 moto razr 50 系列折叠屏手机 选号项目',
    brand: '联想moto razr 50 系列折叠屏手机',
    targetCount: 20,
    platforms: ['小红书蒲公英'],
    budgetMin: 50000,
    budgetMax: 100000,
    status: 'analyzed',
    brief: '情人节礼物场景，高质感数码礼物账号，排除擦边和学生群体。',
    createdAt: '2026-07-04',
    updatedAt: now,
  },
  {
    id: 'project-yoga',
    name: 'YOGA电脑 选号项目',
    brand: 'YOGA电脑',
    targetCount: 50,
    platforms: ['小红书蒲公英'],
    budgetMin: 2000,
    budgetMax: 4000,
    status: 'needs_review',
    brief: '2w-5w KOC，供稿图文，科技数码、国补、时尚高级感、白领高质感，不要学生群体。',
    createdAt: '2026-07-05',
    updatedAt: now,
  },
]

const createResponse = <T>(data: T): ApiResponse<T> => ({
  code: 0,
  message: 'ok',
  success: true,
  data,
})

const matchesFilters = (creator: CreatorProfile, params?: MediaSearchParams) => {
  if (!params) return true

  const text = `${creator.nickname} ${creator.xhsId} ${creator.tags.join(' ')} ${creator.audienceTags.join(' ')}`
  const quote = creator.videoQuote ?? creator.imageQuote ?? 0

  if (params.keyword && !text.includes(params.keyword)) return false
  if (params.platform && params.platform !== '全部' && creator.platform !== params.platform) return false
  if (params.tags?.length && !params.tags.some(tag => creator.tags.includes(tag) || creator.audienceTags.includes(tag))) return false
  if (params.minFollowers && creator.followers < params.minFollowers) return false
  if (params.maxFollowers && creator.followers > params.maxFollowers) return false
  if (params.minQuote && quote < params.minQuote) return false
  if (params.maxQuote && quote > params.maxQuote) return false
  if (params.minRebate && (creator.rebatePercent ?? 0) < params.minRebate) return false
  if (params.maxRebate && (creator.rebatePercent ?? 0) > params.maxRebate) return false
  if (params.entryStatus && params.entryStatus !== '全部入库状态' && creator.entryStatus !== params.entryStatus) return false

  return true
}

export const mediaMockApi = {
  async getCreators(params?: MediaSearchParams) {
    await delay()
    return createResponse(creators.filter(creator => matchesFilters(creator, params)))
  },

  async searchKOLs(params?: MediaSearchParams) {
    await delay()
    const kolList: KOL[] = creators.filter(creator => matchesFilters(creator, params)).map(creator => ({
      id: creator.id,
      name: creator.nickname,
      platform: creator.platform,
      avatar: creator.nickname.slice(0, 1),
      followers: creator.followers,
      engagement: creator.metrics.interactionMedian ?? 0,
      tags: [...creator.tags, ...creator.audienceTags],
      price: creator.videoQuote ?? creator.imageQuote ?? 0,
    }))

    return createResponse(kolList)
  },

  async getProjects() {
    await delay()
    return createResponse(projects)
  },

  async createProject(request: CreateProjectRequest) {
    await delay()
    const project: MediaProject = {
      id: request.id ?? `mock-project-${Date.now()}`,
      name: request.name ?? `${request.analysis?.brand ?? request.brand ?? '新项目'} 选号项目`,
      brand: request.brand ?? request.analysis?.brand ?? '未写明',
      targetCount: request.targetCount ?? request.analysis?.targetCount ?? 10,
      platforms: request.platforms ?? request.analysis?.platforms ?? ['小红书蒲公英'],
      budgetMin: request.budgetMin ?? request.analysis?.budgetMin,
      budgetMax: request.budgetMax ?? request.analysis?.budgetMax,
      status: request.status ?? 'analyzed',
      brief: request.brief,
      analysis: request.analysis,
      createdAt: request.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    projects.unshift(project)
    return createResponse(project)
  },

  async analyzeBrief(request: BriefAnalysisRequest) {
    await delay(420)
    const brief = request.brief
    const isWolong = brief.includes('沃隆')
    const isYoga = brief.includes('YOGA') || brief.includes('yoga') || brief.includes('电脑')
    const isMoto = brief.includes('moto') || brief.includes('情侣') || brief.includes('情人节')

    const analysis: BriefAnalysis = {
      brand: isWolong ? '沃隆' : isYoga ? 'YOGA电脑' : isMoto ? '联想moto razr 50 系列折叠屏手机' : '未写明',
      targetCount: isWolong ? 25 : isYoga ? 50 : isMoto ? 20 : 10,
      platforms: ['小红书蒲公英'],
      budgetMin: isWolong ? 5000 : isYoga ? 2000 : isMoto ? 50000 : undefined,
      budgetMax: isWolong ? 10000 : isYoga ? 4000 : isMoto ? 100000 : undefined,
      cooperationForm: isYoga ? ['图文报备', '供稿直发'] : isWolong ? ['报备图文', '报备视频优先'] : ['待确认'],
      creatorTypes: isWolong
        ? ['美食种草类', '美食开箱测评类']
        : isYoga
          ? ['科技数码', '职场白领', '高质感生活方式']
          : ['情侣生活', '高质感数码礼物', '情人节场景'],
      audienceTags: isWolong ? ['上班族', '学生党', '养生党', '精致妈妈'] : isYoga ? ['白领', '都市青年'] : ['情侣', '礼物决策人群'],
      excludedTags: isYoga ? ['学生群体', '擦边', '断更30天'] : isMoto ? ['擦边', '搬运内容'] : [],
      contentAngles: isWolong ? ['坚果零食', '开箱测评', '办公室零食', '健康零食'] : isYoga ? ['办公效率', '轻薄本', '国补', '职场桌搭'] : ['情人节礼物', '折叠屏手机', '高颜值数码'],
      fanRanges: isYoga
        ? [{ label: 'KOC', min: 20000, max: 50000, ratio: 1 }]
        : [{ label: '按预算和数据优先', min: 10000 }],
      dataThresholds: isWolong ? { cpmMax: 70, cpeMax: 8 } : {},
      hardRequirements: isWolong ? ['平台为小红书蒲公英', '单个预算 5000-10000', 'CPM 小于 70', 'CPE 小于 8'] : ['平台为小红书蒲公英'],
      flexibleRequirements: isWolong ? ['视频优先', '返点暂不参与自动推荐'] : ['同类内容标题优先'],
      searchKeywords: isWolong ? ['美食种草', '坚果零食', '办公室零食', '零食测评'] : isYoga ? ['YOGA电脑', '笔记本电脑', '轻薄本', '职场桌搭'] : ['moto razr 50', '折叠屏手机', '情人节礼物'],
      synonymKeywords: isWolong ? ['小零嘴', '下午茶', '健康零食', '试吃'] : isYoga ? ['办公好物', '职场装备', '高质感桌面'] : ['数码礼物', '情侣礼物', '高颜值手机'],
      productKeywords: isWolong ? ['沃隆', '坚果'] : isYoga ? ['YOGA', '联想电脑', '笔记本电脑'] : ['moto razr 50', '折叠屏'],
      pgyFilterPlan: {
        resetBeforeApply: true,
        primaryCategories: isWolong ? ['美食'] : isYoga ? ['科技数码', '职场'] : ['情感', '生活记录', '科技数码'],
        subCategories: isWolong ? ['美食测评', '美食展示'] : isYoga ? ['移动数码', '电脑测评', '职场生活'] : ['情侣', '好物分享', '数码测评'],
        mappedFilters: [
          {
            group: '合作笔记',
            field: '合作报价',
            values: ['按 brief 单个预算设置'],
            reason: '先限制报价，避免采集明显不可能合作的账号',
          },
          {
            group: '数据表现',
            field: '预估CPM/预估互动单价',
            values: isWolong ? ['CPM < 70', 'CPE < 8'] : ['无硬阈值时按数据排序'],
            reason: '有明确数据阈值时作为硬筛，无阈值时作为排序因素',
          },
        ],
        supplementSearch: isWolong ? ['沃隆坚果', '坚果开箱', '办公室零食'] : isYoga ? ['YOGA电脑', '国补笔记本', '轻薄本测评'] : ['moto razr 50', '情人节数码礼物'],
        validationWarnings: isWolong ? ['不要把非美食主类目混入首轮筛选'] : ['每次应用筛选前必须重置上一轮条件'],
      },
      questions: isWolong
        ? ['四类人群标签是否需要平均分配提报数量？', '视频报价缺失但图文数据优秀的达人是否可做备选？']
        : isYoga
          ? ['粉丝量是否必须限定 2w-5w，还是报价和内容更优可放宽？', '时尚高质感是否只接受非性感/非擦边账号？']
          : ['是否接受非情侣号但能自然做情人节礼物内容的账号？'],
      summary: isWolong
        ? '以小红书蒲公英美食类为主，先锁定预算和CPM/CPE，再用标题判断坚果、零食、开箱测评及人群覆盖。'
        : isYoga
          ? '以科技数码和职场白领账号为主，粉丝量和报价先硬筛，再排除学生、擦边、断更账号。'
          : '以情感生活和高质感数码礼物账号为主，补充搜索moto与情人节礼物内容，排除擦边和低质搬运。',
      sourceProvider: request.provider,
    }

    return createResponse(analysis)
  },

  async startCollection(request: StartCollectionRequest) {
    await delay(300)
    const task: CollectionTask = {
      id: `codex_${Math.random().toString(16).slice(2, 14)}`,
      projectId: request.projectId,
      status: 'queued',
      targetCount: request.targetCount,
      collectedCount: 0,
      candidateCount: 0,
      message: '后台采集器已接收任务，将先重置蒲公英筛选，再按策略采集候选。',
      updatedAt: now,
    }

    return createResponse(task)
  },

  async getCollectionTask(taskId: string) {
    await delay()
    const task: CollectionTask = {
      id: taskId,
      projectId: 'mock-project',
      status: 'queued',
      targetCount: 10,
      collectedCount: 0,
      candidateCount: 0,
      message: 'Mock 采集任务等待中。',
      updatedAt: now,
    }

    return createResponse(task)
  },

  async getProjectResult(projectId: string) {
    await delay()
    const projectCreators = creators.filter(creator => creator.sourceProject?.includes(projectId === 'project-yoga' ? 'YOGA' : '沃隆'))
    const recommendations = projectCreators.map((creator, index) => ({
      id: `rec-${creator.id}`,
      creator,
      tier: index === 0 ? 'strict' as const : 'backup' as const,
      score: index === 0 ? 92 : 78,
      titleMatchSummary: creator.titleStatus === 'collected' ? '标题已采集，可进入内容复核。' : '标题不足，需要补采后再复核。',
      riskNotes: creator.metricStatus === 'official_unavailable' ? ['官网暂无合作数据'] : [],
      requirementHits: [
        { label: '平台符合', passed: true, actual: creator.platform },
        { label: '标题完整', passed: creator.titleStatus === 'collected', actual: `${creator.titlesCollected}/30` },
      ],
    }))

    const result: ProjectResult = {
      projectId,
      strictCount: recommendations.filter(item => item.tier === 'strict').length,
      backupCount: recommendations.filter(item => item.tier === 'backup').length,
      rejectedCount: 0,
      summary: '严格达标不足时会用可备选补足，但可备选需要人工复核标题和标签。',
      recommendations,
    }

    return createResponse(result)
  },

  async getPlatforms() {
    await delay()
    return createResponse(['小红书', '小红书蒲公英', '巨量星图', '视频号互选'])
  },

  async getTags() {
    await delay()
    return createResponse(['美食', '美食测评', '上班族', '学生党', '精致妈妈', '科技数码', '职场', '情侣'])
  },
}
