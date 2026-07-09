<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useMediaStore } from './store'
import type { BriefAnalysis, CreatorProfile, MediaProject, Recommendation } from './types'

const store = useMediaStore()

const briefInput = ref('')
const provider = ref<'codex' | 'deepseek' | 'kimi' | 'compatible'>('codex')
const revisionNotes = ref<string[]>([])

onMounted(() => {
  void store.loadBaseData()
})

const currentCreators = computed(() => {
  if (store.currentView === 'candidate') return store.candidateCreators
  return store.mediaCreators
})

const businessConditions = computed(() => {
  const analysis = store.activeAnalysis
  if (!analysis) return []

  return [
    ['平台', analysis.platforms.join('、')],
    ['推荐数量', `${analysis.targetCount} 个`],
    ['单个预算', formatBudget(analysis.budgetMin, analysis.budgetMax)],
    ['合作形式', analysis.cooperationForm.join('、')],
    ['达人方向', analysis.creatorTypes.join('、')],
    ['人群标签', analysis.audienceTags.join('、')],
    ['排除项', analysis.excludedTags.join('、') || '无'],
    ['数据门槛', formatThresholds(analysis)],
  ].filter(([, value]) => value && value !== '未写明')
})

const detailSections = computed(() => {
  const analysis = store.activeAnalysis
  if (!analysis) return []

  return [
    { title: '内容切入', items: analysis.contentAngles },
    { title: '搜索词', items: analysis.searchKeywords },
    { title: '近义词', items: analysis.synonymKeywords },
    { title: '产品词补充搜索', items: analysis.productKeywords },
    { title: '硬性要求', items: analysis.hardRequirements },
    { title: '可放宽条件', items: analysis.flexibleRequirements },
    { title: '蒲公英主类目', items: analysis.pgyFilterPlan.primaryCategories },
    { title: '蒲公英细分类目', items: analysis.pgyFilterPlan.subCategories },
    { title: '系统找号方式', items: analysis.pgyFilterPlan.validationWarnings },
  ].filter(section => section.items.length > 0)
})

function formatNumber(value?: number): string {
  if (value === undefined) return '-'
  return value.toLocaleString('zh-CN')
}

function formatFollowers(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`
  }

  return formatNumber(value)
}

function formatCurrency(value?: number): string {
  if (value === undefined) return '-'
  return `¥${value.toLocaleString('zh-CN')}`
}

function formatBudget(min?: number, max?: number): string {
  if (min === undefined && max === undefined) return '未写明'
  if (min !== undefined && max !== undefined) return `${formatCurrency(min)}-${formatCurrency(max)}`
  if (min !== undefined) return `不低于 ${formatCurrency(min)}`
  return `不高于 ${formatCurrency(max)}`
}

function formatThresholds(analysis: BriefAnalysis): string {
  const thresholds = []
  if (analysis.dataThresholds.cpmMax !== undefined) thresholds.push(`CPM < ${analysis.dataThresholds.cpmMax}`)
  if (analysis.dataThresholds.cpeMax !== undefined) thresholds.push(`CPE < ${analysis.dataThresholds.cpeMax}`)
  return thresholds.join('、') || '未写明'
}

function formatDate(value?: string): string {
  if (!value) return '未记录'
  return value.slice(0, 10)
}

function formatTitleStatus(creator: CreatorProfile): string {
  if (creator.titleStatus === 'collected') return `已采集标题（${creator.titlesCollected}条）`
  if (creator.titleStatus === 'partial') return `标题不足（${creator.titlesCollected}/30）`
  if (creator.titleStatus === 'missing') return '未采集标题'
  return creator.titleError ?? '标题采集失败'
}

function formatMetricStatus(creator: CreatorProfile): string {
  if (creator.metricStatus === 'official') return '已采集官网指标'
  if (creator.metricStatus === 'official_unavailable') return '官网暂无数据'
  if (creator.metricStatus === 'partial') return creator.metricError ?? '官网指标部分缺失'
  return creator.metricError ?? '指标采集失败'
}

function formatTaskStatus(status?: string): string {
  if (!status) return '未创建'
  const map: Record<string, string> = {
    queued: '等待采集器',
    running: '采集中',
    login_required: '蒲公英待登录',
    done: '已完成',
    error: '失败',
    idle: '未开始',
  }
  return map[status] ?? status
}

function updateKeyword(event: Event) {
  store.updateFilters({ keyword: (event.target as HTMLInputElement).value })
}

function updatePlatform(event: Event) {
  store.updateFilters({ platform: (event.target as HTMLSelectElement).value })
}

function updateEntryStatus(event: Event) {
  store.updateFilters({ entryStatus: (event.target as HTMLSelectElement).value })
}

function analyzeBrief() {
  if (!briefInput.value.trim()) {
    store.setError('请先粘贴 brief')
    return
  }

  void store.analyzeBrief({
    brief: briefInput.value,
    provider: provider.value,
    revisionNotes: revisionNotes.value.filter(Boolean),
  })
}

function addRevisionNote() {
  revisionNotes.value = [...revisionNotes.value, '']
}

function updateRevisionNote(index: number, event: Event) {
  revisionNotes.value[index] = (event.target as HTMLTextAreaElement).value
}

function startCollection() {
  void store.startCollection()
}

function openProject(project: MediaProject) {
  briefInput.value = project.brief
  void store.openProject(project)
}

function markSelected(recommendation: Recommendation) {
  store.markClientSelected(recommendation.id)
}
</script>

<template>
  <div class="media-page">
    <section class="media-header">
      <div>
        <p class="eyebrow">Media KOL</p>
        <h1 class="page-title">智能媒体库</h1>
        <p>从 brief 确认选号方向，再进入候选库、推荐结果和可复用媒体库。</p>
      </div>
      <div class="media-nav">
        <button :class="{ active: store.currentView === 'home' }" @click="store.navigate('home')">首页</button>
        <button :class="{ active: store.currentView === 'projects' }" @click="store.navigate('projects')">项目管理</button>
        <button :class="{ active: store.currentView === 'candidate' }" @click="store.openLibrary('candidate')">候选库</button>
        <button :class="{ active: store.currentView === 'library' }" @click="store.openLibrary('library')">媒体库</button>
      </div>
    </section>

    <DsError v-if="store.error" class="page-error" :message="store.error" @retry="store.setError(null)" />

    <section v-if="store.currentView === 'home'" class="entry-grid">
      <button class="entry-card" @click="store.navigate('projects')">
        <span>PM</span>
        <strong>项目管理</strong>
        <em>新建 brief、确认选号方向、启动采集和查看推荐。</em>
      </button>
      <button class="entry-card" @click="store.openLibrary('candidate')">
        <span>CD</span>
        <strong>候选库</strong>
        <em>所有采集账号先进入候选库，等待规则筛选和标题复核。</em>
      </button>
      <button class="entry-card" @click="store.openLibrary('library')">
        <span>ML</span>
        <strong>媒体库</strong>
        <em>仅沉淀已补返点和联系方式的可复用达人。</em>
      </button>
    </section>

    <section v-else-if="store.currentView === 'projects'" class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Project Management</p>
          <h2>项目管理</h2>
          <p>项目改成横排列表，便于快速查看历史项目和进入结果。</p>
        </div>
        <button class="primary" @click="store.navigate('project-detail')">新建项目</button>
      </div>

      <div class="project-table">
        <div class="project-row project-head">
          <span>项目</span>
          <span>品牌</span>
          <span>预算/数量</span>
          <span>平台</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        <button v-for="project in store.projects" :key="project.id" class="project-row" @click="openProject(project)">
          <strong>{{ project.name }}</strong>
          <span>{{ project.brand }}</span>
          <span>{{ formatBudget(project.budgetMin, project.budgetMax) }} / {{ project.targetCount }}个</span>
          <span>{{ project.platforms.join('、') }}</span>
          <span>{{ project.status }}</span>
          <span class="row-link">查看</span>
        </button>
      </div>
    </section>

    <section v-else-if="store.currentView === 'library' || store.currentView === 'candidate'" class="panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">{{ store.currentView === 'library' ? 'Media Library' : 'Candidate Library' }}</p>
          <h2>{{ store.currentView === 'library' ? '媒体库' : '候选库' }}</h2>
          <p>
            {{
              store.currentView === 'library'
                ? '只展示已补返点和联系方式的可复用达人。'
                : '采集账号先进入候选库，候选不自动沉淀进媒体库。'
            }}
          </p>
        </div>
        <button class="secondary" @click="store.navigate('projects')">去项目管理</button>
      </div>

      <div class="filters">
        <select :value="store.filters.platform" @change="updatePlatform">
          <option v-for="item in store.platforms" :key="item" :value="item">{{ item }}</option>
        </select>
        <select :value="store.filters.entryStatus" @change="updateEntryStatus">
          <option>全部入库状态</option>
          <option>正式入库</option>
          <option>候选库</option>
          <option>待修复</option>
        </select>
        <input :value="store.filters.keyword" placeholder="搜索达人/标签/人设" @input="updateKeyword" />
        <button class="secondary" @click="store.refreshCreators">刷新列表</button>
      </div>

      <DsLoading v-if="store.loading" text="正在加载媒体数据..." />
      <div v-else class="creator-table">
        <div class="creator-row creator-head">
          <span>达人昵称</span>
          <span>入库状态</span>
          <span>小红书号</span>
          <span>蒲公英主页</span>
          <span>报价</span>
          <span>数据中位数</span>
          <span>成本指标</span>
          <span>状态</span>
          <span>价格/数据更新</span>
          <span>商务</span>
        </div>
        <div v-for="creator in currentCreators" :key="creator.id" class="creator-row">
          <span class="creator-name">
            <b>{{ creator.nickname }}</b>
            <small>粉丝数：{{ formatFollowers(creator.followers) }}</small>
          </span>
          <span><em class="pill">{{ creator.entryStatus }}</em></span>
          <span>{{ creator.xhsId }}</span>
          <span><a :href="creator.pgyHomeUrl" target="_blank" rel="noreferrer">打开主页</a></span>
          <span>
            图文 {{ formatCurrency(creator.imageQuote) }}<br />
            视频 {{ formatCurrency(creator.videoQuote) }}
          </span>
          <span>
            曝光：{{ formatNumber(creator.metrics.exposureMedian) }}<br />
            阅读：{{ formatNumber(creator.metrics.readMedian) }}<br />
            互动：{{ formatNumber(creator.metrics.interactionMedian) }}
          </span>
          <span>
            CPM：{{ formatNumber(creator.metrics.estimatedCpm) }}<br />
            阅读：{{ formatNumber(creator.metrics.estimatedReadUnitPrice) }}<br />
            互动：{{ formatNumber(creator.metrics.estimatedInteractionUnitPrice) }}
          </span>
          <span class="status-stack">
            <em class="ok">{{ formatMetricStatus(creator) }}</em>
            <em :class="creator.titleStatus === 'collected' ? 'ok' : 'warn'">{{ formatTitleStatus(creator) }}</em>
          </span>
          <span>
            价格：{{ formatDate(creator.quoteUpdatedAt) }}<br />
            数据：{{ formatDate(creator.dataUpdatedAt) }}
          </span>
          <span>
            返点：{{ creator.rebatePercent ?? '-' }}<br />
            联系：{{ creator.contact ?? '-' }}
          </span>
        </div>
      </div>
      <DsEmpty v-if="!store.loading && currentCreators.length === 0" title="暂无达人" description="调整筛选或导入媒体数据。" />
    </section>

    <section v-else class="project-detail">
      <div class="brief-panel">
        <div class="panel-heading compact">
          <div>
            <p class="eyebrow">Project Brief</p>
            <h2>输入 brief</h2>
          </div>
          <button class="secondary" @click="store.navigate('projects')">返回项目</button>
        </div>
        <textarea v-model="briefInput" placeholder="粘贴客户 brief，系统会先拆解选号方向。" />
        <div class="provider-row">
          <button :class="{ active: provider === 'codex' }" @click="provider = 'codex'">Codex</button>
          <button :class="{ active: provider === 'deepseek' }" @click="provider = 'deepseek'">DeepSeek</button>
          <button :class="{ active: provider === 'kimi' }" @click="provider = 'kimi'">Kimi</button>
          <button :class="{ active: provider === 'compatible' }" @click="provider = 'compatible'">兼容 API</button>
        </div>
        <button class="primary wide" :disabled="store.analyzing" @click="analyzeBrief">
          {{ store.analyzing ? '拆解中...' : 'AI 拆解需求' }}
        </button>
      </div>

      <div class="confirm-panel">
        <div class="panel-heading compact">
          <div>
            <p class="eyebrow">Confirm Requirements</p>
            <h2>确认需求</h2>
          </div>
          <em v-if="store.activeAnalysis" class="status-badge">{{ store.activeAnalysis.sourceProvider }} 已拆解</em>
        </div>

        <div v-if="!store.activeAnalysis" class="empty-box">粘贴 brief 后点击“AI 拆解需求”，这里会显示业务确认摘要。</div>
        <template v-else>
          <div class="summary-box">
            <b>选号结论</b>
            <p>{{ store.activeAnalysis.summary }}</p>
          </div>

          <div class="condition-grid">
            <div v-for="[label, value] in businessConditions" :key="label" class="condition-item">
              <span>{{ label }}</span>
              <strong>{{ value }}</strong>
            </div>
          </div>

          <div class="question-box">
            <div class="question-head">
              <b>需要确认</b>
              <span>{{ store.activeAnalysis.questions.length }} 项</span>
            </div>
            <p v-if="store.activeAnalysis.questions.length === 0">可直接开始找号。</p>
            <ol v-else>
              <li v-for="question in store.activeAnalysis.questions" :key="question">{{ question }}</li>
            </ol>
          </div>

          <div class="revision-box">
            <b>确认与修正</b>
            <div v-for="(note, index) in revisionNotes" :key="index" class="revision-row">
              <span>{{ index + 1 }}</span>
              <textarea :value="note" placeholder="填写这一条确认或修正意见" @input="updateRevisionNote(index, $event)" />
            </div>
            <button class="secondary" @click="addRevisionNote">+ 添加补充意见</button>
            <button class="primary" :disabled="store.analyzing" @click="analyzeBrief">
              {{ store.analyzing ? '带着修正重新拆解中...' : '带着修正重新拆解' }}
            </button>
          </div>

          <details class="detail-drawer">
            <summary>查看完整拆解详情</summary>
            <section v-for="section in detailSections" :key="section.title">
              <h4>{{ section.title }}</h4>
              <span v-for="item in section.items" :key="item" class="tag">{{ item }}</span>
            </section>
            <section>
              <h4>蒲公英筛选映射</h4>
              <p v-for="filter in store.activeAnalysis.pgyFilterPlan.mappedFilters" :key="`${filter.group}-${filter.field}`">
                {{ filter.group }} / {{ filter.field }}：{{ filter.values.join('、') }}。{{ filter.reason }}
              </p>
            </section>
          </details>

          <div class="collection-box">
            <button class="primary" :disabled="store.loading" @click="startCollection">
              {{ store.loading ? '提交中...' : '确认并开始找号' }}
            </button>
            <button v-if="store.collectionTask" class="secondary" :disabled="store.loading" @click="store.refreshCollectionTask">
              刷新采集状态
            </button>
            <button v-if="store.activeProject" class="secondary" :disabled="store.loading" @click="store.refreshProjectResult">
              刷新推荐结果
            </button>
            <div v-if="store.collectionTask" class="task-status">
              <b>采集任务：{{ store.collectionTask.id }}</b>
              <span :class="['task-badge', store.collectionTask.status]">{{ formatTaskStatus(store.collectionTask.status) }}</span>
              <p>{{ store.collectionTask.message }}</p>
              <small>
                目标 {{ store.collectionTask.targetCount }} 个，已回传 {{ store.collectionTask.candidateCount }} 个候选。若一直停在“等待采集器”，说明固定 worker 还没有启动或没有连上服务器。
              </small>
            </div>
          </div>
        </template>
      </div>

      <div v-if="store.activeResult" class="result-panel">
        <div class="panel-heading compact">
          <div>
            <p class="eyebrow">Recommendation Result</p>
            <h2>推荐结果</h2>
            <p>{{ store.activeResult.summary }}</p>
          </div>
          <button class="secondary" @click="store.navigate('projects')">返回项目管理</button>
        </div>

        <h3>严格达标 · {{ store.strictRecommendations.length }} 个</h3>
        <div v-for="recommendation in store.strictRecommendations" :key="recommendation.id" class="recommend-row">
          <strong>{{ recommendation.creator.nickname }}</strong>
          <span>{{ formatFollowers(recommendation.creator.followers) }}</span>
          <span>图文 {{ formatCurrency(recommendation.creator.imageQuote) }} / 视频 {{ formatCurrency(recommendation.creator.videoQuote) }}</span>
          <span>{{ recommendation.titleMatchSummary }}</span>
          <button class="secondary" @click="markSelected(recommendation)">
            {{ recommendation.creator.selectedByClient ? '客户已选' : '标记客户选中' }}
          </button>
        </div>

        <h3>可备选 · {{ store.backupRecommendations.length }} 个</h3>
        <div v-for="recommendation in store.backupRecommendations" :key="recommendation.id" class="recommend-row backup">
          <strong>{{ recommendation.creator.nickname }}</strong>
          <span>{{ formatFollowers(recommendation.creator.followers) }}</span>
          <span>图文 {{ formatCurrency(recommendation.creator.imageQuote) }} / 视频 {{ formatCurrency(recommendation.creator.videoQuote) }}</span>
          <span>{{ recommendation.titleMatchSummary }}</span>
          <button class="secondary" @click="markSelected(recommendation)">
            {{ recommendation.creator.selectedByClient ? '客户已选' : '标记客户选中' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.media-page {
  padding: 32px;
  color: #202124;
  animation: pageEnter 0.2s ease;
}

.media-header,
.panel-heading,
.creator-row,
.project-row,
.recommend-row {
  display: flex;
  align-items: center;
}

.media-header,
.panel-heading {
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.media-header h1,
.panel-heading h2 {
  margin: 0;
  font-size: 34px;
  line-height: 1.2;
}

.media-header p,
.panel-heading p,
.entry-card em,
.condition-item span,
.creator-name small,
.empty-box {
  color: #777;
}

.eyebrow {
  margin: 0 0 8px;
  color: #ff7f5f;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.media-nav,
.provider-row,
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button,
select,
input,
textarea {
  border: 1px solid #ddd;
  background: #fff;
  color: #202124;
  font: inherit;
}

button {
  min-height: 42px;
  padding: 0 18px;
  font-weight: 800;
  cursor: pointer;
}

button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.media-nav button.active,
.provider-row button.active,
.primary {
  border-color: #ff7f5f;
  background: #ff7f5f;
  color: #fff;
}

.secondary {
  background: #fff;
}

.wide {
  width: 100%;
  margin-top: 14px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.entry-card {
  display: grid;
  gap: 16px;
  min-height: 210px;
  padding: 32px;
  text-align: left;
}

.entry-card span {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border: 1px solid #202124;
  font-weight: 900;
}

.entry-card strong {
  font-size: 28px;
}

.panel,
.brief-panel,
.confirm-panel,
.result-panel {
  border: 1px solid #e7e7e7;
  background: #fff;
  padding: 24px;
}

.project-table,
.creator-table {
  border: 1px solid #ececec;
  overflow-x: auto;
}

.project-row,
.creator-row {
  display: grid;
  width: 100%;
  border: 0;
  border-bottom: 1px solid #ececec;
  text-align: left;
}

.project-row {
  grid-template-columns: 2fr 1fr 1.4fr 1fr 1fr 80px;
  gap: 16px;
  padding: 18px;
  background: #fff;
}

.creator-row {
  grid-template-columns: 180px 100px 120px 120px 160px 150px 150px 170px 140px 120px;
  gap: 18px;
  min-width: 1420px;
  padding: 18px 20px;
}

.project-head,
.creator-head {
  background: #f7f7f7;
  color: #777;
  font-weight: 800;
}

.row-link {
  color: #ff7f5f;
  font-weight: 800;
}

.filters {
  margin-bottom: 18px;
}

.filters select,
.filters input {
  height: 44px;
  padding: 0 14px;
}

.creator-name {
  display: grid;
  gap: 6px;
}

.pill,
.tag,
.ok,
.warn,
.status-badge {
  display: inline-block;
  padding: 6px 10px;
  font-style: normal;
  font-weight: 800;
}

.pill,
.tag {
  background: #f1f1f1;
}

.ok {
  background: #eafff3;
  color: #007a4d;
}

.warn {
  background: #fff1e8;
  color: #c84812;
}

.status-stack {
  display: grid;
  align-content: start;
  gap: 8px;
}

.project-detail {
  display: grid;
  grid-template-columns: minmax(360px, 0.9fr) minmax(480px, 1.3fr);
  gap: 20px;
}

.project-detail textarea {
  min-height: 220px;
  padding: 16px;
  resize: vertical;
}

.brief-panel,
.confirm-panel,
.result-panel {
  display: grid;
  gap: 18px;
  align-content: start;
}

.result-panel {
  grid-column: 1 / -1;
}

.compact {
  margin-bottom: 0;
}

.empty-box,
.summary-box,
.question-box,
.revision-box,
.detail-drawer,
.collection-box {
  border: 1px solid #ececec;
  padding: 18px;
}

.collection-box {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-start;
}

.task-status {
  display: grid;
  flex-basis: 100%;
  gap: 8px;
  margin-top: 4px;
  border: 1px solid #ececec;
  background: #fafafa;
  padding: 14px;
}

.task-status p,
.task-status small {
  margin: 0;
  color: #666;
}

.task-badge {
  width: fit-content;
  padding: 4px 10px;
  background: #f1f1f1;
  color: #555;
  font-weight: 800;
}

.task-badge.queued,
.task-badge.running {
  background: #fff1e8;
  color: #c84812;
}

.task-badge.done {
  background: #eafff3;
  color: #007a4d;
}

.task-badge.error,
.task-badge.login_required {
  background: #fff0f0;
  color: #c62828;
}

.summary-box p {
  margin: 10px 0 0;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.45;
}

.condition-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.condition-item {
  display: grid;
  gap: 8px;
  border: 1px solid #ececec;
  padding: 14px;
}

.question-head {
  display: flex;
  justify-content: space-between;
}

.revision-row {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  margin: 12px 0;
}

.revision-row textarea {
  min-height: 86px;
}

.detail-drawer summary {
  cursor: pointer;
  font-weight: 800;
}

.detail-drawer section {
  margin-top: 16px;
}

.detail-drawer h4 {
  margin: 0 0 8px;
}

.tag {
  margin: 0 6px 6px 0;
}

.recommend-row {
  display: grid;
  grid-template-columns: 1.2fr 120px 240px 1fr 150px;
  gap: 14px;
  border-bottom: 1px solid #ececec;
  padding: 16px 0;
}

.recommend-row.backup {
  color: #684000;
}

.page-error {
  margin-bottom: 16px;
}

@media (max-width: 960px) {
  .media-page {
    padding: 18px;
  }

  .entry-grid,
  .project-detail,
  .condition-grid {
    grid-template-columns: 1fr;
  }

  .project-row,
  .recommend-row {
    grid-template-columns: 1fr;
  }
}
</style>
