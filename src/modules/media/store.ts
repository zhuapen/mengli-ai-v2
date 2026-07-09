import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { mediaService } from './service'
import type {
  BriefAnalysis,
  BriefAnalysisRequest,
  CollectionTask,
  CreatorProfile,
  MediaFilters,
  MediaLibraryKind,
  MediaProject,
  MediaView,
  ProjectResult,
} from './types'

const defaultFilters = (): MediaFilters => ({
  keyword: '',
  platform: '全部',
  tag: '',
  entryStatus: '全部入库状态',
  updateStatus: '全部更新状态',
})

export const useMediaStore = defineStore('media', () => {
  const currentView = ref<MediaView>('home')
  const creators = ref<CreatorProfile[]>([])
  const projects = ref<MediaProject[]>([])
  const platforms = ref<string[]>([])
  const tags = ref<string[]>([])
  const filters = ref<MediaFilters>(defaultFilters())
  const activeProject = ref<MediaProject | null>(null)
  const activeAnalysis = ref<BriefAnalysis | null>(null)
  const activeResult = ref<ProjectResult | null>(null)
  const collectionTask = ref<CollectionTask | null>(null)
  const loading = ref(false)
  const analyzing = ref(false)
  const error = ref<string | null>(null)

  const mediaCreators = computed(() => creators.value.filter(creator => creator.entryStatus === '正式入库'))
  const candidateCreators = computed(() => creators.value.filter(creator => creator.entryStatus !== '正式入库'))
  const strictRecommendations = computed(() => activeResult.value?.recommendations.filter(item => item.tier === 'strict') ?? [])
  const backupRecommendations = computed(() => activeResult.value?.recommendations.filter(item => item.tier === 'backup') ?? [])

  const hasActiveProject = computed(() => activeProject.value !== null)

  function setError(message: string | null) {
    error.value = message
  }

  function navigate(view: MediaView) {
    currentView.value = view
    setError(null)
  }

  function updateFilters(nextFilters: Partial<MediaFilters>) {
    filters.value = {
      ...filters.value,
      ...nextFilters,
    }
  }

  function resetFilters() {
    filters.value = defaultFilters()
  }

  async function loadBaseData() {
    loading.value = true
    setError(null)
    try {
      const [creatorData, projectData, platformData, tagData] = await Promise.all([
        mediaService.getCreators(),
        mediaService.getProjects(),
        mediaService.getPlatforms(),
        mediaService.getTags(),
      ])

      creators.value = creatorData
      projects.value = projectData
      platforms.value = ['全部', ...platformData]
      tags.value = tagData
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '媒体库初始化失败')
    } finally {
      loading.value = false
    }
  }

  async function refreshCreators() {
    loading.value = true
    setError(null)
    try {
      creators.value = await mediaService.getCreators(filters.value)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '达人列表刷新失败')
    } finally {
      loading.value = false
    }
  }

  async function analyzeBrief(request: BriefAnalysisRequest) {
    analyzing.value = true
    setError(null)
    try {
      activeAnalysis.value = await mediaService.analyzeBrief(request)
      const project = await mediaService.createProject({
        id: activeProject.value?.id,
        name: `${activeAnalysis.value.brand} 选号项目`,
        brief: request.brief,
        analysis: activeAnalysis.value,
      })
      activeProject.value = project
      activeResult.value = null
      collectionTask.value = null

      if (projects.value.some(item => item.id === project.id)) {
        projects.value = projects.value.map(item => (item.id === project.id ? project : item))
      } else {
        projects.value = [project, ...projects.value]
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '拆解 brief 失败')
    } finally {
      analyzing.value = false
    }
  }

  async function startCollection() {
    if (!activeProject.value || !activeAnalysis.value) {
      setError('请先完成 brief 拆解并确认需求')
      return
    }

    loading.value = true
    setError(null)
    try {
      collectionTask.value = await mediaService.startCollection({
        projectId: activeProject.value.id,
        targetCount: activeAnalysis.value.targetCount,
        analysis: activeAnalysis.value,
      })
      activeProject.value = {
        ...activeProject.value,
        status: 'collecting',
      }
      projects.value = projects.value.map(project => (project.id === activeProject.value?.id ? activeProject.value : project))
      activeResult.value = await mediaService.getProjectResult(activeProject.value.id)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '创建采集任务失败')
    } finally {
      loading.value = false
    }
  }

  async function refreshCollectionTask() {
    if (!collectionTask.value) {
      setError('当前没有采集任务')
      return
    }

    loading.value = true
    setError(null)
    try {
      collectionTask.value = await mediaService.getCollectionTask(collectionTask.value.id)
      if (activeProject.value) {
        activeResult.value = await mediaService.getProjectResult(activeProject.value.id)
        if (collectionTask.value.status === 'done') {
          activeProject.value = {
            ...activeProject.value,
            status: 'ready',
          }
          await refreshCreators()
        }
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '刷新采集状态失败')
    } finally {
      loading.value = false
    }
  }

  async function refreshProjectResult() {
    if (!activeProject.value) {
      setError('请先打开项目')
      return
    }

    loading.value = true
    setError(null)
    try {
      activeResult.value = await mediaService.getProjectResult(activeProject.value.id)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '刷新推荐结果失败')
    } finally {
      loading.value = false
    }
  }

  async function openProject(project: MediaProject) {
    loading.value = true
    setError(null)
    try {
      activeProject.value = project
      activeAnalysis.value = project.analysis ?? null
      collectionTask.value = null
      activeResult.value = await mediaService.getProjectResult(project.id)
      currentView.value = 'project-detail'
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '打开项目失败')
      activeProject.value = project
      activeAnalysis.value = project.analysis ?? null
      currentView.value = 'project-detail'
    } finally {
      loading.value = false
    }
  }

  function openLibrary(kind: MediaLibraryKind) {
    currentView.value = kind === 'library' ? 'library' : 'candidate'
    updateFilters({
      entryStatus: kind === 'library' ? '正式入库' : '候选库',
    })
  }

  function markClientSelected(recommendationId: string) {
    if (!activeResult.value) return

    activeResult.value = {
      ...activeResult.value,
      recommendations: activeResult.value.recommendations.map(item => ({
        ...item,
        creator: item.id === recommendationId
          ? {
              ...item.creator,
              selectedByClient: true,
            }
          : item.creator,
      })),
    }
  }

  return {
    currentView,
    creators,
    projects,
    platforms,
    tags,
    filters,
    activeProject,
    activeAnalysis,
    activeResult,
    collectionTask,
    loading,
    analyzing,
    error,
    mediaCreators,
    candidateCreators,
    strictRecommendations,
    backupRecommendations,
    hasActiveProject,
    navigate,
    updateFilters,
    resetFilters,
    loadBaseData,
    refreshCreators,
    analyzeBrief,
    startCollection,
    refreshCollectionTask,
    refreshProjectResult,
    openProject,
    openLibrary,
    markClientSelected,
    setError,
  }
})
