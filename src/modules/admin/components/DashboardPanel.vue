<script setup lang="ts">
import { useAdminStore } from '../store'

const store = useAdminStore()
</script>

<template>
  <div class="dashboard-panel">
    <!-- 统计卡片 -->
    <div v-if="store.dashboardData" class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ store.dashboardData.stats.totalUsers }}</div>
        <div class="stat-label">总用户</div>
      </div>
      <div class="stat-card warning">
        <div class="stat-value">{{ store.dashboardData.stats.pendingUsers }}</div>
        <div class="stat-label">待审批</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">{{ store.dashboardData.stats.activeUsers }}</div>
        <div class="stat-label">活跃用户</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.dashboardData.stats.todayLogins }}</div>
        <div class="stat-label">今日登录</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.dashboardData.stats.copyGenerationsToday }}</div>
        <div class="stat-label">今日文案</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.dashboardData.stats.imageGenerationsToday }}</div>
        <div class="stat-label">今日图片</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.dashboardData.stats.successRate }}%</div>
        <div class="stat-label">成功率</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">¥{{ store.dashboardData.stats.estimatedCostToday }}</div>
        <div class="stat-label">今日消耗</div>
      </div>
    </div>

    <!-- 趋势图 -->
    <div v-if="store.dashboardData" class="section">
      <h3 class="section-title">近 7 天使用趋势</h3>
      <div class="trend-chart">
        <div
          v-for="item in store.dashboardData.trends"
          :key="item.date"
          class="trend-bar-wrapper"
        >
          <div
            class="trend-bar"
            :style="{ height: (item.value / 40) * 100 + '%' }"
          />
          <div class="trend-label">{{ item.date }}</div>
        </div>
      </div>
    </div>

    <!-- 功能使用排行 -->
    <div v-if="store.dashboardData" class="section">
      <h3 class="section-title">功能使用排行</h3>
      <div class="feature-list">
        <div v-for="item in store.dashboardData.featureUsage" :key="item.feature" class="feature-item">
          <div class="feature-name">{{ item.feature }}</div>
          <div class="feature-bar-bg">
            <div class="feature-bar" :style="{ width: item.percentage + '%' }" />
          </div>
          <div class="feature-count">{{ item.count }}</div>
        </div>
      </div>
    </div>

    <!-- 最近注册用户 -->
    <div v-if="store.dashboardData" class="section">
      <h3 class="section-title">高消耗用户</h3>
      <div class="top-user-list">
        <div v-for="user in store.dashboardData.topUsers" :key="user.id" class="top-user-item">
          <span class="top-user-name">{{ user.display_name }}</span>
          <span class="top-user-email">{{ user.email }}</span>
          <span class="top-user-usage">{{ user.usage }} 次</span>
          <span class="top-user-cost">¥{{ user.cost }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-panel {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  padding: 24px;
  background: var(--ds-color-gray-50);
  border: 1px solid var(--ds-color-gray-100);
  text-align: center;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card.warning {
  border-left: 3px solid var(--ds-color-warning);
}

.stat-card.success {
  border-left: 3px solid var(--ds-color-success);
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section {
  padding: 24px;
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 20px;
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 120px;
}

.trend-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.trend-bar {
  width: 100%;
  background: var(--ds-color-primary);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
}

.trend-label {
  font-size: 11px;
  color: var(--ds-color-gray-400);
  margin-top: 8px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-name {
  width: 100px;
  font-size: 13px;
  font-weight: 600;
}

.feature-bar-bg {
  flex: 1;
  height: 8px;
  background: var(--ds-color-gray-100);
  border-radius: 4px;
  overflow: hidden;
}

.feature-bar {
  height: 100%;
  background: var(--ds-color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.feature-count {
  width: 50px;
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  color: var(--ds-color-gray-500);
}

.top-user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.top-user-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--ds-color-gray-50);
  border-radius: 8px;
}

.top-user-name {
  font-weight: 600;
  font-size: 14px;
  min-width: 80px;
}

.top-user-email {
  font-size: 13px;
  color: var(--ds-color-gray-400);
  flex: 1;
}

.top-user-usage {
  font-size: 13px;
  font-weight: 600;
}

.top-user-cost {
  font-size: 13px;
  font-weight: 700;
  color: var(--ds-color-primary);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
