export type MediaView = 'home' | 'library' | 'candidate' | 'projects' | 'project-detail'

export type MediaLibraryKind = 'library' | 'candidate'

export type MediaPlatform = '小红书' | '小红书蒲公英' | '巨量星图' | '视频号互选'

export type CreatorEntryStatus = '正式入库' | '候选库' | '待修复'

export type TitleStatus = 'collected' | 'partial' | 'missing' | 'failed'

export type MetricStatus = 'official' | 'official_unavailable' | 'partial' | 'failed'

export type ProjectStatus = 'draft' | 'analyzed' | 'collecting' | 'ready' | 'needs_review'

export type RecommendationTier = 'strict' | 'backup' | 'rejected'

export type CollectionStatus = 'idle' | 'queued' | 'running' | 'login_required' | 'done' | 'error'

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
  minFollowers?: number
  maxFollowers?: number
  minQuote?: number
  maxQuote?: number
  minRebate?: number
  maxRebate?: number
  updateStatus?: string
  entryStatus?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface CreatorMetrics {
  exposureMedian?: number
  readMedian?: number
  interactionMedian?: number
  estimatedCpm?: number
  estimatedReadUnitPrice?: number
  estimatedInteractionUnitPrice?: number
  collectedAt?: string
}

export interface CreatorProfile {
  id: string
  nickname: string
  xhsId: string
  platform: MediaPlatform
  pgyHomeUrl: string
  followers: number
  imageQuote?: number
  videoQuote?: number
  rebatePercent?: number
  contact?: string
  tags: string[]
  audienceTags: string[]
  titlesCollected: number
  titleStatus: TitleStatus
  titleError?: string
  metricStatus: MetricStatus
  metricError?: string
  metrics: CreatorMetrics
  quoteUpdatedAt?: string
  dataUpdatedAt?: string
  sourceProject?: string
  entryStatus: CreatorEntryStatus
  selectedByClient?: boolean
  updatedAt: string
}

export interface MediaFilters extends MediaSearchParams {
  keyword: string
  platform: string
  tag: string
}

export interface BriefAnalysisRequest {
  brief: string
  provider: 'codex' | 'deepseek' | 'kimi' | 'compatible'
  revisionNotes?: string[]
}

export interface DataThresholds {
  cpmMax?: number
  cpeMax?: number
}

export interface FanRange {
  label: string
  min?: number
  max?: number
  ratio?: number
}

export interface PgyMappedFilter {
  group: string
  field: string
  values: string[]
  excludeValues?: string[]
  min?: number
  max?: number
  reason: string
}

export interface PgyFilterPlan {
  resetBeforeApply: boolean
  primaryCategories: string[]
  subCategories: string[]
  mappedFilters: PgyMappedFilter[]
  supplementSearch: string[]
  validationWarnings: string[]
}

export interface BriefAnalysis {
  brand: string
  targetCount: number
  platforms: MediaPlatform[]
  budgetMin?: number
  budgetMax?: number
  cooperationForm: string[]
  creatorTypes: string[]
  audienceTags: string[]
  excludedTags: string[]
  contentAngles: string[]
  fanRanges: FanRange[]
  dataThresholds: DataThresholds
  hardRequirements: string[]
  flexibleRequirements: string[]
  searchKeywords: string[]
  synonymKeywords: string[]
  productKeywords: string[]
  pgyFilterPlan: PgyFilterPlan
  questions: string[]
  summary: string
  sourceProvider: string
}

export interface MediaProject {
  id: string
  name: string
  brand: string
  targetCount: number
  platforms: MediaPlatform[]
  budgetMin?: number
  budgetMax?: number
  status: ProjectStatus
  brief: string
  analysis?: BriefAnalysis
  createdAt: string
  updatedAt: string
}

export interface RecommendationRequirementHit {
  label: string
  passed: boolean
  actual?: string
  issue?: string
}

export interface Recommendation {
  id: string
  creator: CreatorProfile
  tier: RecommendationTier
  score: number
  requirementHits: RecommendationRequirementHit[]
  titleMatchSummary: string
  riskNotes: string[]
}

export interface ProjectResult {
  projectId: string
  strictCount: number
  backupCount: number
  rejectedCount: number
  summary: string
  recommendations: Recommendation[]
}

export interface CollectionTask {
  id: string
  projectId: string
  status: CollectionStatus
  targetCount: number
  collectedCount: number
  candidateCount: number
  message: string
  startedAt?: string
  updatedAt: string
}

export interface StartCollectionRequest {
  projectId: string
  targetCount: number
  analysis: BriefAnalysis
}

export interface MediaDashboardData {
  creators: CreatorProfile[]
  projects: MediaProject[]
}
