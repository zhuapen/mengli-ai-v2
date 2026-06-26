# Mengli AI Platform V2 - 架构规则

## 一、核心架构原则

### 分层结构
```
Page → Store → Service → API → Backend
```

### 各层职责
- **Page**：组合组件，调用 Store
- **Store**：调用本模块 Service，维护本模块状态
- **Service**：业务编排（扣积分→生成→保存→日志→通知）
- **API**：纯 HTTP 请求，无业务逻辑

### 禁止行为
- ✗ Store 直接 axios/fetch
- ✗ Store 直接操作 DOM
- ✗ Store 跨模块修改状态
- ✗ Page 直接调用 API
- ✗ Component 直接调用 API
- ✗ 使用 window 全局变量
- ✗ 单文件超过 500 行
- ✗ 复制旧项目代码结构
- ✗ 使用 any 类型

### 模块隔离
- 每个业务模块独立目录，互不直接引用
- 模块间通信：API / Event Bus / 共享类型

---

## 二、目录结构

```
src/
├── core/                   # 核心层（全局共享）
│   ├── api/                # Axios 实例
│   ├── stores/             # 全局 Store（用户/权限/UI）
│   ├── types/              # 全局类型
│   ├── utils/              # 工具函数
│   ├── hooks/              # 全局 Hooks
│   ├── cache/              # 统一缓存
│   ├── queue/              # AI 请求队列
│   ├── event/              # 事件总线
│   ├── logger/             # 日志系统
│   ├── config/             # 配置中心
│   ├── error/              # 错误边界
│   └── constants/          # 全局常量
│
├── design-system/          # 设计系统
│   ├── tokens/             # Design Token
│   └── components/         # 基础 UI 组件
│
├── layouts/                # 布局组件
│
├── modules/                # 业务模块
│   └── [module]/
│       ├── api.ts          # 纯 HTTP 请求
│       ├── service.ts      # 业务编排
│       ├── store.ts        # 状态管理
│       ├── types.ts        # 类型定义
│       ├── hooks/          # 模块 Hooks
│       ├── domain/         # 领域模型
│       ├── page.vue        # 页面入口
│       └── components/     # 模块组件
│
├── router/                 # 路由
└── docs/                   # 项目文档
```

---

## 三、代码规范

### TypeScript
- 严格模式
- 禁止 `any`（必要时加注释）
- 所有 API 响应定义类型

### 文件命名
- 组件：PascalCase（`HomePage.vue`）
- 工具函数：camelCase（`formatDate.ts`）
- 类型文件：camelCase（`user.ts`）
- 常量：UPPER_SNAKE_CASE

### 组件结构
```vue
<script setup lang="ts">
// 1. 导入
// 2. Props / Emits
// 3. 状态
// 4. 计算属性
// 5. 方法
// 6. 生命周期
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### 单文件限制
- 建议不超过 500 行
- 超过时考虑拆分组件或提取逻辑

---

## 四、状态管理规则

### 全局 Store（core/stores/）
- auth：认证状态（token、refreshToken）
- user：用户信息（profile、permissions）
- app：UI 状态（loading、sidebar、theme）

### 模块 Store（modules/*/store.ts）
- 仅管理本模块状态
- 通过 service.ts 调用业务逻辑
- 不直接调用 API

---

## 五、模块间通信

### 允许的方式
1. **API**：通过 HTTP 请求获取数据
2. **Event Bus**：通过事件通知其他模块
3. **共享类型**：通过 core/types 共享类型定义

### 禁止的方式
- 直接 import 其他模块的 store
- 直接修改其他模块的状态

---

## 六、错误处理

### 统一使用 useRequest
```typescript
const { data, loading, error, execute, retry } = useRequest(apiFunction)
```

### 五种状态
1. **Loading**：加载中
2. **Error**：错误
3. **Empty**：空数据
4. **Permission**：无权限
5. **Content**：正常内容

---

## 七、功能开关

使用 Feature Flag 控制功能启用/禁用：
```typescript
import { isFeatureEnabled } from '@/core/config/feature'

if (isFeatureEnabled('enablePlugin')) {
  // 显示插件功能
}
```

---

## 八、日志规范

使用统一的 logger：
```typescript
import { logger } from '@/core/logger'

logger.info('User logged in', { userId })
logger.error('API call failed', error)
logger.captureException(exception)
```

---

## 九、缓存规范

使用统一的 cache：
```typescript
import { cache } from '@/core/cache'

// 内存缓存（5分钟）
cache.setMemory('key', data, 5 * 60 * 1000)
const data = cache.getMemory('key')

// Session 缓存
cache.setSession('key', data)

// Local 缓存
cache.setLocal('key', data)
```

禁止直接使用 `localStorage` / `sessionStorage`

---

## 十、AI 请求队列

所有 AI 请求通过队列管理：
```typescript
import { aiQueue } from '@/core/queue'

const result = await aiQueue.add('task-id', () => api.generate(prompt))
```

---

## 十一、代码检查清单

每个模块完成后检查：

- [ ] Page 是否只调用 Store？
- [ ] Store 是否只调用本模块 Service？
- [ ] Service 是否负责业务编排？
- [ ] API 是否只负责请求？
- [ ] 是否有跨模块引用？
- [ ] 单文件是否超过 500 行？
- [ ] 是否使用了 any 类型？
- [ ] 是否有 window 全局变量？
- [ ] 是否使用了统一 useRequest？
- [ ] 是否使用了统一 Cache？

---

## 十二、UI 规范

- 100% 复刻旧系统视觉效果
- 代码全新实现，不允许复制旧代码
- 使用 Design Token 定义颜色、字体、间距
- 基础组件使用 `Ds` 前缀命名

---

## 十三、开发流程规范

### 分阶段开发

#### Phase 1：UI 还原（优先级 ★★★★★）
- 先还原 UI，不接 API
- 使用 Mock 数据（`src/mocks/`）
- UI 与 V1 保持 95% 以上一致
- 后端可独立开发，互不阻塞

#### Phase 2：API 对接（优先级 ★★★★☆）
- UI 稳定后再接 API
- 逐步替换：Mock → 真实 API → 联调 → 完成

#### Phase 3：优化
- 权限、日志、缓存、队列、性能优化

### Phase 检查清单

每个 Phase 完成后必须执行：

- [ ] `npm run lint`
- [ ] `npm run type-check`
- [ ] `npm run build`
- [ ] `npm run dev`（手动测试）
- [ ] Git Commit（规范格式）
- [ ] 部署测试环境

---

## 十四、Mock 规范

### Mock 优先原则
所有页面先使用 Mock 数据，不调用真实接口。

### Mock 文件位置
```
src/mocks/
├── index.ts        # 统一导出
├── home.ts         # 首页 Mock
├── copy.ts         # 文案 Mock
├── image.ts        # 图片 Mock
├── media.ts        # 媒体库 Mock
├── user.ts         # 用户 Mock
└── history.ts      # 历史 Mock
```

### 使用方式
```typescript
import { mockKOLList } from '@/mocks/media'

const kolList = ref(mockKOLList)
```

### 切换到真实 API
后续只需替换数据源：
```typescript
// Mock 阶段
const kolList = ref(mockKOLList)

// API 阶段
const { data: kolList } = useRequest(() => mediaApi.getList())
```

---

## 十五、环境变量规范

### 环境文件
```
.env.development    # 开发环境
.env.staging        # 测试环境
.env.production     # 生产环境
.env.local          # 本地覆盖（git 忽略）
```

### 变量命名
- 必须以 `VITE_` 开头
- 使用 UPPER_SNAKE_CASE

### 常用变量
```bash
VITE_API_BASE_URL=/api          # API 地址
VITE_APP_TITLE=萌力互动          # 应用标题
VITE_APP_ENV=development        # 环境标识
```

---

## 十六、Git Commit 规范

### 格式
```
<type>(<scope>): <subject>
```

### Type 类型
- `feat`：新功能
- `fix`：修复
- `refactor`：重构
- `style`：样式调整
- `docs`：文档
- `chore`：构建/工具

### 示例
```
feat(home): 完成首页 UI 还原
feat(copy): 完成 AI 文案页面
fix(login): 修复登录跳转问题
refactor(layout): 优化导航布局
style(button): 调整按钮样式
docs(readme): 更新项目说明
chore(deps): 升级依赖版本
```
