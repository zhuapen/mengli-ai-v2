import { api } from '@/core/api'
import type {
  ApiResponse,
  BriefAnalysis,
  BriefAnalysisRequest,
  CollectionTask,
  CreatorProfile,
  KOL,
  MediaProject,
  MediaSearchParams,
  ProjectResult,
  StartCollectionRequest,
} from './types'

const unwrap = <T>(response: T | ApiResponse<T>): T => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiResponse<T>).data
  }

  return response as T
}

export const mediaApi = {
  async getCreators(params?: MediaSearchParams) {
    return unwrap(await api.get<CreatorProfile[] | ApiResponse<CreatorProfile[]>>('/media/creators', { params }))
  },

  async searchKOLs(params?: MediaSearchParams) {
    return unwrap(await api.get<KOL[] | ApiResponse<KOL[]>>('/media/kols', { params }))
  },

  async getProjects() {
    return unwrap(await api.get<MediaProject[] | ApiResponse<MediaProject[]>>('/media/projects'))
  },

  async analyzeBrief(request: BriefAnalysisRequest) {
    return unwrap(await api.post<BriefAnalysis | ApiResponse<BriefAnalysis>>('/media/brief-intelligence', request))
  },

  async startCollection(request: StartCollectionRequest) {
    return unwrap(await api.post<CollectionTask | ApiResponse<CollectionTask>>('/media/collection-tasks', request))
  },

  async getProjectResult(projectId: string) {
    return unwrap(await api.get<ProjectResult | ApiResponse<ProjectResult>>(`/media/projects/${projectId}/result`))
  },

  async getPlatforms() {
    return unwrap(await api.get<string[] | ApiResponse<string[]>>('/media/platforms'))
  },

  async getTags() {
    return unwrap(await api.get<string[] | ApiResponse<string[]>>('/media/tags'))
  },
}
