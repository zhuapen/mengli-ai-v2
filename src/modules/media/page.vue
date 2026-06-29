<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useMediaStore } from './store'

const store = useMediaStore()

onMounted(() => {
  store.init()
})

const currentView = ref<'home' | 'database' | 'project'>('home')

function formatFollowers(num: number): string {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num.toString()
}

function getEngagementLevel(rate: number): string {
  if (rate >= 5) return 'high'
  if (rate >= 3) return 'mid'
  return 'low'
}

const selectedKOLs = ref<string[]>([])
function toggleSelectKOL(id: string) {
  const index = selectedKOLs.value.indexOf(id)
  if (index === -1) {
    selectedKOLs.value.push(id)
  } else {
    selectedKOLs.value.splice(index, 1)
  }
}

function isSelected(id: string): boolean {
  return selectedKOLs.value.includes(id)
}
</script>

<template>
  <div class="media-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">智能媒体库</h1>
          <p class="page-desc">先选媒体库或项目管理，再按 brief 确认需求、生成推荐结果</p>
        </div>
      </div>
    </div>

    <!-- 入口视图 -->
    <div v-if="currentView === 'home'" class="workbench-shell">
      <section class="find-view">
        <div class="entry-grid">
          <button class="entry-card" @click="currentView = 'database'">
            <div class="entry-mark">DB</div>
            <div class="entry-title">媒体库</div>
            <div class="entry-desc">
              沉淀已选优质达人、导入账号，并支持标签、报价、返点筛选和人工修正。
            </div>
          </button>
          <button class="entry-card" @click="currentView = 'project'">
            <div class="entry-mark">PM</div>
            <div class="entry-title">项目管理</div>
            <div class="entry-desc">
              新建 brief 找号，或回看过去项目的推荐名单、系统判断、反馈记录和导出结果。
            </div>
          </button>
        </div>
      </section>
    </div>

    <!-- 媒体库视图 -->
    <div v-else-if="currentView === 'database'" class="workbench-shell">
      <div class="workbench-panel">
        <!-- 顶部操作栏 -->
        <div class="view-topbar">
          <div>
            <div class="panel-kicker">Media Library</div>
            <div class="view-title">媒体库</div>
            <div class="view-desc">只展示已选优质达人和导入账号，普通采集候选不会自动进入媒体库。</div>
          </div>
          <div class="workbench-top-actions">
            <button class="ghost-btn">导入 Excel/CSV</button>
            <button class="primary-btn" @click="currentView = 'project'">去项目管理</button>
          </div>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar">
          <div class="filter-inner">
            <select
              :value="store.selectedPlatform"
              class="compact-select"
              @change="store.setPlatform(($event.target as HTMLSelectElement).value)"
            >
              <option v-for="p in store.platforms" :key="p" :value="p">
                {{ p === '全部' ? '全部平台' : p }}
              </option>
            </select>

            <input
              v-model="store.keyword"
              class="compact-input"
              placeholder="搜索达人/标签/人设"
            />

            <div class="filter-sep" />

            <div class="filter-tags">
              <button
                v-for="tag in store.tags"
                :key="tag"
                class="filter-chip"
                :class="{ active: store.selectedTags.includes(tag) }"
                @click="store.toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>

            <button v-if="selectedKOLs.length > 0" class="cart-btn">
              已选 <span class="badge">{{ selectedKOLs.length }}</span>
            </button>
          </div>
        </div>

        <!-- 数据表格 -->
        <div class="table-container">
          <DsLoading v-if="store.loading && store.kolList.length === 0" text="正在加载达人数据..." />

          <DsError
            v-else-if="store.error && store.kolList.length === 0"
            :message="store.error"
            @retry="store.init()"
          />

          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>达人</th>
                  <th>平台</th>
                  <th>粉丝数</th>
                  <th>标签</th>
                  <th>互动率</th>
                  <th>报价</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="kol in store.filteredList" :key="kol.id">
                  <td>
                    <div class="kol-name">
                      <div class="kol-avatar">{{ kol.avatar }}</div>
                      <div class="kol-info">
                        <div class="name">{{ kol.name }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ kol.platform }}</td>
                  <td class="follower-num">{{ formatFollowers(kol.followers) }}</td>
                  <td>
                    <span v-for="tag in kol.tags" :key="tag" class="tag">{{ tag }}</span>
                  </td>
                  <td>
                    <span class="eng" :class="getEngagementLevel(kol.engagement)">
                      {{ kol.engagement }}%
                    </span>
                  </td>
                  <td class="price">
                    ¥{{ kol.price.toLocaleString() }}
                    <small>/篇</small>
                  </td>
                  <td>
                    <button
                      class="add-btn"
                      :class="{ added: isSelected(kol.id) }"
                      @click="toggleSelectKOL(kol.id)"
                    >
                      {{ isSelected(kol.id) ? '已选' : '选择' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <DsEmpty
              v-if="store.filteredList.length === 0 && !store.loading"
              icon="📭"
              title="暂无匹配的达人"
              description="尝试调整筛选条件或搜索关键词"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 项目管理视图 -->
    <div v-else-if="currentView === 'project'" class="workbench-shell">
      <div class="workbench-panel">
        <div class="view-topbar">
          <div>
            <div class="panel-kicker">Project Management</div>
            <div class="view-title">项目管理</div>
            <div class="view-desc">新建 brief 找号，或回看过去项目的推荐名单。</div>
          </div>
          <div class="workbench-top-actions">
            <button class="ghost-btn" @click="currentView = 'database'">返回媒体库</button>
            <button class="primary-btn">新建项目</button>
          </div>
        </div>

        <DsEmpty
          icon="📋"
          title="暂无项目"
          description="点击「新建项目」开始创建"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.media-page {
  animation: pageEnter 0.6s ease;
}

/* Page Header */
.page-header {
  padding: 48px 48px 0;
  border-bottom: 1px solid var(--ds-color-gray-100);
  background: var(--ds-color-white);
}

.page-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--ds-color-black), var(--ds-color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin-top: 8px;
}

/* Workbench Shell */
.workbench-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
}

/* Entry Grid */
.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.entry-card {
  padding: 40px;
  background: var(--ds-color-white);
  border: 2px solid var(--ds-color-gray-100);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--ds-font-family);
}

.entry-card:hover {
  border-color: var(--ds-color-primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.entry-mark {
  font-size: 24px;
  font-weight: 800;
  color: var(--ds-color-primary);
  margin-bottom: 16px;
}

.entry-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.entry-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  line-height: 1.8;
}

/* Workbench Panel */
.workbench-panel {
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  padding: 32px;
}

.view-topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.panel-kicker {
  font-size: 11px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}

.view-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.view-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
}

.workbench-top-actions {
  display: flex;
  gap: 12px;
}

.ghost-btn {
  padding: 10px 20px;
  background: transparent;
  border: 1.5px solid var(--ds-color-gray-200);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
}

.ghost-btn:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
}

.primary-btn {
  padding: 10px 20px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
}

.primary-btn:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
}

/* Filter Bar */
.filter-bar {
  padding: 20px 0;
  border-bottom: 1px solid var(--ds-color-gray-100);
  margin-bottom: 24px;
}

.filter-inner {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.compact-select {
  padding: 10px 32px 10px 16px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-family: var(--ds-font-family);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23808080'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

.compact-input {
  padding: 10px 16px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-family: var(--ds-font-family);
  outline: none;
  width: 200px;
  transition: all 0.3s ease;
}

.compact-input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.compact-input::placeholder {
  color: var(--ds-color-gray-300);
}

.filter-sep {
  width: 1px;
  height: 32px;
  background: var(--ds-color-gray-200);
}

.filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 10px 20px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--ds-font-family);
}

.filter-chip:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-chip.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cart-btn {
  margin-left: auto;
  padding: 12px 24px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--ds-font-family);
  transition: all 0.3s ease;
}

.cart-btn:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cart-btn .badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  margin-left: 8px;
  font-size: 12px;
}

/* Table */
.table-container {
  padding: 0;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 800px;
}

thead th {
  padding: 16px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--ds-color-black);
}

tbody td {
  padding: 20px;
  border-bottom: 1px solid var(--ds-color-gray-100);
  vertical-align: middle;
}

tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: var(--ds-color-gray-50);
  transform: scale(1.01);
}

.kol-name {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kol-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: var(--ds-color-gray-50);
  border: 1px solid var(--ds-color-gray-100);
  transition: all 0.3s ease;
}

.kol-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  background: var(--ds-color-primary);
}

.kol-info .name {
  font-weight: 700;
  font-size: 14px;
}

.follower-num {
  font-weight: 800;
  font-size: 15px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background: var(--ds-color-gray-100);
  font-size: 11px;
  font-weight: 600;
  margin: 2px 4px;
  transition: all 0.2s ease;
}

.tag:hover {
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  transform: translateY(-2px);
}

.eng {
  display: inline-block;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.eng:hover {
  transform: scale(1.05);
}

.eng.high {
  background: var(--ds-color-success-bg);
  color: var(--ds-color-success);
}

.eng.mid {
  background: var(--ds-color-warning-bg);
  color: var(--ds-color-warning);
}

.eng.low {
  background: var(--ds-color-error-bg);
  color: var(--ds-color-error);
}

.price {
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
}

.price small {
  font-weight: 400;
  font-size: 11px;
  color: var(--ds-color-gray-400);
}

.price:hover {
  color: var(--ds-color-primary);
}

.add-btn {
  padding: 10px 20px;
  border: 2px solid var(--ds-color-black);
  background: var(--ds-color-white);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--ds-font-family);
}

.add-btn:hover {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.add-btn.added {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px;
  color: var(--ds-color-gray-300);
}

.empty-state .icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 400;
}

.empty-state p {
  font-size: 14px;
  margin-top: 8px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
