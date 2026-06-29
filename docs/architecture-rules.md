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

## 十四、Mock / API 切换规范（Phase 2）

### 核心铁律
```
Page → Store → Service → API / Mock API
```

### 数据流
```
UI 触发 → Page → Store（状态管理）→ Service（业务编排）→ API / Mock API → 后端 / Mock 数据
```

### 各层职责（严格遵守）

| 层 | 职责 | 禁止 |
|----|------|------|
| **Page** | 只负责 UI + 调 Store | ❌ 直接 import mocks、直接请求数据、setTimeout 模拟 |
| **Store** | 只做状态管理，只调 Service | ❌ 直接请求 API、写业务逻辑 |
| **Service** | 业务编排 + Mock/API 切换 | ❌ 写 UI 逻辑、直接操作 DOM |
| **API** | 只负责 HTTP 请求 | ❌ 任何业务逻辑 |
| **Mock API** | 模拟后端响应 | ❌ 任何业务逻辑 |

### Mock / API 切换开关
```typescript
// core/config/feature.ts
export const features = {
  enableMock: true, // true = Mock API，false = 真实 API
}
```

### Service 统一写法
```typescript
import { isFeatureEnabled } from '@/core/config/feature'
import { xxxApi } from './api'
import { xxxMockApi } from '@/mocks/xxx'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const xxxService = {
  async getData(params) {
    const impl = useMock() ? xxxMockApi.getData : xxxApi.getData
    return await impl(params)
  },
}
```

### Mock API 标准格式
```typescript
// src/mocks/xxx.ts
import type { ApiResponse } from '@/core/types/api'

export const xxxMockApi = {
  async getData(params: GetDataParams): Promise<ApiResponse<GetDataResponse>> {
    await delay(500)
    return { code: 0, message: 'success', data: { ... } }
  },
}
```

### 模块标准文件结构
```
src/modules/<module>/
  ├── page.vue      # 只消费 Store
  ├── store.ts      # Pinia 状态管理
  ├── service.ts    # 业务编排 + Mock/API 切换
  ├── api.ts        # 纯 HTTP 请求
  ├── types.ts      # 类型定义
  └── components/   # 模块私有组件（可选）
```

### 禁止行为
- ❌ Page 直接 import mocks
- ❌ Page 直接写 fetch / axios
- ❌ Store 直接请求 API
- ❌ setTimeout 模拟业务逻辑
- ❌ 跨模块直接引用 store
- ❌ 使用 any 类型（核心层除外）
- ❌ 使用 console.log（使用 logger）

### 一键切换
将 `enableMock` 改为 `false`，所有模块自动切换到真实 API。无需修改任何页面或 Store 代码。

### 已接入 API 路径

#### Auth 模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /auth/login | 登录 |
| POST | /auth/register | 注册 |
| POST | /auth/logout | 登出 |
| GET | /auth/me | 获取当前用户 |

#### copy 文案模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /copy/generate | 生成文案 |
| POST | /copy/refine | 优化文案 |
| GET | /copy/templates | 获取模板 |
| GET | /copy/brands | 获取品牌 |
| GET | /copy/history | 获取历史 |

#### image 图片模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /image/generate | 生成图片 |
| GET | /image/styles | 获取风格 |
| GET | /image/history | 获取历史 |

#### media 媒体库模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /media | 获取媒体列表 |
| POST | /media/upload | 上传媒体 |
| DELETE | /media/:id | 删除媒体 |
| GET | /media/kols | 搜索 KOL |
| GET | /media/platforms | 获取平台 |
| GET | /media/tags | 获取标签 |

#### assets 素材库模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /assets | 获取素材列表 |
| POST | /assets | 创建素材 |
| DELETE | /assets/:id | 删除素材 |

#### history 历史记录模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /history | 获取历史列表 |
| DELETE | /history/:id | 删除单条历史 |
| DELETE | /history | 清空全部历史 |

#### article 公众号写稿模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /article/generate | 生成文章 |
| POST | /article/upload | 上传文件 |
| GET | /article/templates | 获取模板 |
| GET | /article/drafts | 获取草稿列表 |
| POST | /article/drafts | 保存草稿 |
| GET | /article/history | 获取历史 |

#### datacenter 数据中心模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /datacenter/features | 获取功能卡片 |
| GET | /datacenter/overview | 获取概览数据 |
| GET | /datacenter/trends | 获取趋势数据 |
| GET | /datacenter/channels | 获取渠道数据 |
| GET | /datacenter/top-contents | 获取热门内容 |

#### plugin 插件中心模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /plugins | 获取插件列表 |
| GET | /plugins/:id | 获取插件详情 |
| GET | /plugins/categories | 获取插件分类 |
| POST | /plugins/:id/enable | 启用插件 |
| POST | /plugins/:id/disable | 禁用插件 |

#### home 首页模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /home/case-studies | 获取案例 |
| GET | /home/about | 获取关于我们 |
| GET | /home/overview | 获取首页概览 |
| GET | /home/recent | 获取最近记录 |
| GET | /home/shortcuts | 获取快捷入口 |

---

## 十五、页面状态规范（Phase 3.4）

### 核心组件

| 组件 | 用途 | 关键 Props |
|------|------|-----------|
| `DsLoading` | 加载状态 | `text`/`size`/`overlay` |
| `DsError` | 错误状态 + 重试 | `title`/`message`/`retryText`/`showRetry` → emit `retry` |
| `DsEmpty` | 空数据状态 | `icon`/`title`/`description`/`actionText`/`showAction` → emit `action` |

### 使用规则

#### 初始加载
- `loading=true` 且数据为空 → 展示 `DsLoading`
- `loading=true` 但已有数据 → 保留旧数据，不闪空页面

#### 错误状态
- `store.error` 存在且无数据 → 展示 `DsError` + retry
- retry 调用当前页面的初始化 action
- 错误文案来自 `store.error`，不允许页面自己拼 ApiError

#### 空状态
- 数据加载完成且列表为空 → 展示 `DsEmpty`
- 搜索结果为空时文案应体现"未找到相关结果"

#### 局部操作状态
- 生成/上传/保存/删除等操作 → 使用按钮 loading/disabled
- 不使用全屏 Loading

### Store error 规范

```typescript
// 所有 action 统一模式
async function someAction(): Promise<void> {
  loading.value = true
  error.value = null          // 开始时清空
  try {
    // ...
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败'
  } finally {
    loading.value = false      // finally 重置
  }
}
```

### 组合式工具

```typescript
import { usePageState } from '@/core/hooks/usePageState'

const { isInitialLoading, isEmpty, hasError } = usePageState({
  loading: store.loading,
  error: store.error,
  data: store.items,
})
```

---

## 十六、环境变量规范

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

---

## 十八、API Contract 与后端联调

### 文档索引

- **API Contract**：[docs/api-contract.md](./api-contract.md) — 前后端接口约定
- **联调 Checklist**：[docs/backend-integration-checklist.md](./backend-integration-checklist.md) — 后端联调检查清单

### 错误码规范

```typescript
// src/core/api/error-code.ts
export enum ApiErrorCode {
  Success = 0,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ValidationError = 422,
  ServerError = 500,
  NetworkError = 10000,
  UnknownError = 10001,
}
```

### API 层规则

- `api.ts` 只负责 HTTP 请求，返回解包后的 `T`
- `mock.ts` 返回 `ApiResponse<T>` 包裹格式
- `service.ts` 判断 `enableMock` 切换数据源
- `store.ts` 只调用 `service`
- `page.vue` 只消费 `store`

### 联调切换

```bash
# 开发环境（Mock）
VITE_ENABLE_MOCK=true

# 联调/生产环境（真实 API）
VITE_ENABLE_MOCK=false
VITE_API_BASE_URL=https://api.mengliai.cn/api
```

---

## 十九、测试规范（Phase 4）

### 测试技术栈

- **Vitest**：单元测试 / Store / Service 测试
- **@vue/test-utils**：Vue 组件测试
- **jsdom**：组件测试运行环境
- **Playwright**：E2E 测试

### 测试目录

```
tests/
├── setup.ts              # 测试环境 setup
├── utils/                # 测试工具
├── unit/                 # 单元测试
│   ├── core/             # 核心层测试
│   ├── services/         # Service 测试
│   ├── stores/           # Store 测试
│   └── components/       # 组件测试
└── e2e/                  # E2E 测试
```

### 运行命令

```bash
npm run test:unit         # 运行单元测试
npm run test:e2e          # 运行 E2E 测试
npm run check             # 完整检查（build + lint + test）
```

### 测试文档

详见 [docs/testing-guide.md](./testing-guide.md)

---

## 二十、部署规范（Phase 5）

### 部署架构

```
Vue/Vite → npm run build → dist/ → 腾讯云 CVM → Nginx → 域名访问
```

### 环境变量

| 变量 | 开发环境 | 生产环境 |
|------|----------|----------|
| `VITE_APP_ENV` | development | production |
| `VITE_API_BASE_URL` | http://localhost:3000/api | /api |
| `VITE_ENABLE_MOCK` | true | false |

### Nginx 关键配置

```nginx
# 前端路由 fallback
location / {
    try_files $uri $uri/ /index.html;
}

# 后端 API 反向代理
location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_set_header Authorization $http_authorization;
}
```

### 部署文档索引

- **部署指南**：[docs/tencent-cloud-deployment.md](./tencent-cloud-deployment.md)
- **发布检查清单**：[docs/release-checklist.md](./release-checklist.md)

### 部署命令

```bash
# 本地构建
npm run build

# 部署到腾讯云
export TENCENT_CVM_HOST=YOUR_SERVER_IP
export TENCENT_CVM_USER=root
export TENCENT_CVM_TARGET_DIR=/var/www/mengli-ai-platform/dist
npm run deploy:tencent
```

---

## 二十一、QA 规范（Phase 6）

### 问题优先级

| 级别 | 定义 | 上线要求 |
|------|------|----------|
| **P0** | 阻断上线 | 必须修复 |
| **P1** | 影响核心流程 | 必须修复 |
| **P2** | 体验问题 | 建议修复 |
| **P3** | 优化建议 | 可延后 |

### 上线前必跑 Checklist

- [ ] `npm run build` 通过
- [ ] `npm run test:unit` 全部通过
- [ ] Auth 全流程通过（登录/退出/401/刷新恢复）
- [ ] 核心功能冒烟（copy/image/history/assets）
- [ ] 移动端无严重溢出
- [ ] 无 P0/P1 问题

### QA 文档

- **QA 检查清单**：[docs/qa-checklist.md](./qa-checklist.md)
- **发布检查清单**：[docs/release-checklist.md](./release-checklist.md)
