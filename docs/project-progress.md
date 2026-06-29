# Mengli AI Platform V2 - 项目进度

## 当前阶段：Phase 3.3 进行中

### 更新时间
2026-06-29

---

## 一、已完成模块

### Phase 0：项目初始化 ✅
- Vite + Vue3 + TypeScript 项目搭建
- 目录结构创建
- 核心层实现（api/stores/utils/hooks/cache/event/logger/queue/config）
- 设计系统（Design Token + 基础组件）
- 路由配置
- 环境变量配置
- ESLint + Prettier 配置
- Git 初始化

### Phase 1：核心页面 UI ✅
- 首页（Hero + 功能卡片 + 案例 + 关于我们 + Footer）
- 导航栏（Logo + 链接 + 登录/注册按钮）
- 登录弹窗
- AI 文案页面
- AI 图片页面
- 媒体库页面
- 历史记录页面

### Phase 1.5：全站 UI 完善 ✅
- 公众号写稿页面
- 品牌知识库页面（已删除）
- 素材库页面
- 插件中心页面
- 数据中心页面
- 注册页面
- 404 页面
- 小红书文案撰写（从"文案撰写"重构）

### Phase 2：Mock → Service 分离重构 ✅

- `enableMock` Feature Flag 开关
- 所有模块建立标准五件套：types.ts + api.ts + mock.ts + service.ts + store.ts
- Mock API 统一格式（Promise<ApiResponse<T>>）
- Service 层统一 Mock/API 自动切换
- 页面层彻底消除数据耦合

### Phase 3.1：全局 API 基建升级 ✅

- `src/core/api/types.ts` — 统一 ApiResponse<T>（含 success 字段）、ApiError、PaginationParams、PaginationResult
- `src/core/api/http.ts` — Axios 实例统一治理：请求拦截自动带 token、401 自动清理跳转、错误统一转 ApiError
- `src/core/auth/token.ts` — Token 统一管理：get/set/remove AccessToken/RefreshToken、clearTokens
- `src/core/config/feature.ts` — enableMock 从 `VITE_ENABLE_MOCK` 环境变量读取
- `.env.development` / `.env.production` — 环境变量治理
- `env.d.ts` — Vite 环境变量类型定义

### Phase 3.2：Auth 真实登录闭环 ✅

- `src/modules/auth/types.ts` — 标准化 LoginParams、RegisterParams、AuthUser、AuthTokens、LoginResult、RegisterResult
- `src/modules/auth/api.ts` — 真实 API：login、register、logout、getCurrentUser
- `src/modules/auth/mock.ts` — Mock API，返回结构与真实 API 完全一致
- `src/modules/auth/service.ts` — 统一 Mock/API 切换，login/register 写入 token，logout 清理 token
- `src/core/stores/user.ts` — 统一管理 user/token/isLoggedIn/loading/error，支持 restoreSession
- `src/router/index.ts` — 路由守卫：有 token 无 user 时自动 restoreSession，已登录跳转首页

### Phase 3.3：核心业务接口接入（第一批）✅

#### copy 文案生成模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 CopyGenerateParams、CopyGenerateResult、CopyRefineParams、CopyHistoryItem |
| api.ts | ✅ | 新增 getHistory，路径：POST /copy/generate、GET /copy/templates、GET /copy/brands、GET /copy/history |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、history、fetchHistory、clearResult、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### image AI 图片生成模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 ImageStyleId、ImageSizeOption、ImageHistoryItem |
| api.ts | ✅ | 新增 getHistory，路径：POST /image/generate、GET /image/styles、GET /image/history |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、history、taskId、fetchHistory、clearResult、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

### Phase 3.3：核心业务接口接入（第二批）✅

#### media 媒体库模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 MediaItem、MediaQueryParams、MediaUploadParams、MediaListResult，保留 KOL 类型 |
| api.ts | ✅ | 新增 getMediaList、uploadMedia、deleteMedia，保留 searchKOLs、getPlatforms、getTags |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、uploading、upload、remove、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### assets 素材库模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 AssetItem、AssetQueryParams、CreateAssetParams、AssetListResult |
| api.ts | ✅ | 新增 create，路径：GET /assets、POST /assets、DELETE /assets/:id |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、creating、total、keyword、create、setKeyword、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### history 历史记录模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 HistoryItem、HistoryQueryParams、HistoryListResult |
| api.ts | ✅ | 新增 remove、clear，路径：GET /history、DELETE /history/:id、DELETE /history |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、clearing、total、keyword、remove、clear、setKeyword、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

### Phase 3.3：核心业务接口接入（第三批）✅

#### article 公众号写稿模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 ArticleGenerateParams、ArticleGenerateResult、ArticleDraft、ArticleHistoryItem、ArticleHistoryResult |
| api.ts | ✅ | 新增 getDrafts、saveDraft、getHistory，路径：POST /article/generate、GET /article/drafts、POST /article/drafts、GET /article/history |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、saving、drafts、history、total、keyword、saveDraft、fetchDrafts、fetchHistory、setKeyword、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### datacenter 数据中心模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 DateRange、MetricCard、TrendPoint、ChannelMetric、TopContentItem、DatacenterOverview、DatacenterQueryParams |
| api.ts | ✅ | 新增 getOverview、getTrends、getChannels、getTopContents |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、loading、metrics、trends、channels、topContents、range、fetchOverview、setRange、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### plugin 插件中心模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 PluginItem、PluginCategory、PluginQueryParams、PluginListResult |
| api.ts | ✅ | 新增 getCategories、enable、disable |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、operating、categories、total、keyword、enable、disable、toggle、setKeyword、setCategory、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

#### home 首页模块

| 文件 | 状态 | 说明 |
|------|------|------|
| types.ts | ✅ | 补齐 HomeStat、HomeShortcut、HomeRecentItem、HomeOverview |
| api.ts | ✅ | 新增 getOverview、getRecentItems、getShortcuts |
| mock.ts | ✅ | 新建模块内 mock，返回结构与真实 API 一致 |
| service.ts | ✅ | 统一 Mock/API 切换 + 错误转换 + logger |
| store.ts | ✅ | 新增 error、loading、stats、shortcuts、recentItems、fetchOverview、fetchRecentItems、fetchShortcuts、clearError |
| page.vue | ✅ | 无需改动，已只消费 store |

### Phase 3.4：全局 Loading / Error / Empty 标准化 ✅

#### 设计系统组件增强

| 组件 | 增强内容 |
|------|----------|
| DsLoading | 新增 `overlay` prop，支持容器级遮罩 loading |
| DsError | 重构 props：`title`/`message`/`retryText`/`showRetry`，支持 string 错误消息 |
| DsEmpty | 新增 `actionText`/`showAction` props + `action` 事件 |

#### 新增组合式工具

| 文件 | 说明 |
|------|------|
| `src/core/hooks/usePageState.ts` | 统一判断 isInitialLoading / isEmpty / hasError |

#### Store error 清理一致性修复

所有 9 个模块的 store 中，所有 action 均已统一在执行前 `error.value = null`，避免 stale error 残留。

#### 页面标准化

| 页面 | Loading | Error | Empty | 说明 |
|------|---------|-------|-------|------|
| copy | ✅ DsLoading | ✅ DsError | 内联占位 | 生成区 loading + error + 空态 |
| image | ✅ DsLoading | ✅ DsError | 内联占位 | 预览区 loading + error + 空态 |
| media | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | 表格区 loading + error + 空态 |
| assets | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | 列表区 loading + error + 空态 |
| history | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | 列表区 loading + error + 空态 |
| article | ✅ DsLoading | ✅ DsError | 内联占位 | 生成区 loading + error + 空态 |
| datacenter | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | 功能卡片区 loading + error + 空态 |
| plugin | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | 插件列表区 loading + error + 空态 |
| home | — | ✅ DsError | ✅ DsEmpty | 案例/关于我们区 error + 空态 |

---

## 二、待完成模块

### Phase 3.5：真实后端联调准备 / API Contract 对齐 ✅

#### API 错误码规范

| 文件 | 说明 |
|------|------|
| `src/core/api/error-code.ts` | 新建。统一错误码枚举 + 文案映射 |
| `src/core/api/http.ts` | 更新。响应拦截器使用错误码规范 |
| `src/core/api/index.ts` | 更新。re-export 错误码 |

#### API Contract 文档

| 文件 | 说明 |
|------|------|
| `docs/api-contract.md` | 新建。前后端接口约定：通用响应/错误/分页/鉴权结构 + 全模块接口清单 + 数据类型参考 |
| `docs/backend-integration-checklist.md` | 新建。后端联调逐项检查清单 |

#### 类型一致性修复

| 模块 | 修复 |
|------|------|
| plugin/mock.ts | `getDetail` 返回类型从 `PluginItem | null` 修正为 `PluginItem`，与 api.ts 一致 |

#### 扫描结果

- ✅ 无 `Promise<any>`
- ✅ 无 `any`（核心层除外）
- ✅ 无 `AxiosResponse` 暴露在 modules
- ✅ `enableMock` 仅出现在 service.ts
- ✅ page.vue 无 mock/api/service 直引
- ✅ store.ts 无 mock/api 直引

### Phase 4：测试体系与质量保障 ✅

#### 测试工具安装

| 工具 | 版本 | 用途 |
|------|------|------|
| vitest | ^4.1.9 | 单元测试框架 |
| @vue/test-utils | ^2.4.11 | Vue 组件测试 |
| jsdom | ^29.1.1 | 测试运行环境 |
| @playwright/test | ^1.61.1 | E2E 测试 |

#### 测试配置

| 文件 | 说明 |
|------|------|
| `vitest.config.ts` | Vitest 配置：jsdom 环境 + @ alias + setupFiles |
| `playwright.config.ts` | Playwright 配置：chromium + baseURL + webServer |
| `tests/setup.ts` | 测试环境 setup：localStorage/sessionStorage polyfill |
| `tests/utils/test-pinia.ts` | 测试用 Pinia 工具 |
| `tests/utils/mock-api.ts` | Mock 数据工具 |

#### package.json 新增 scripts

| Script | 命令 |
|--------|------|
| `test` | `vitest` |
| `test:unit` | `vitest run` |
| `test:unit:watch` | `vitest` |
| `test:coverage` | `vitest run --coverage` |
| `test:e2e` | `playwright test` |
| `test:e2e:ui` | `playwright test --ui` |
| `check` | `npm run build && npx eslint src/ && npm run test:unit` |

#### 单元测试覆盖（60 个测试）

| 类型 | 文件 | 测试数 |
|------|------|--------|
| Core | `api-error-code.test.ts` | 4 |
| Core | `token.test.ts` | 9 |
| Service | `copy.service.test.ts` | 6 |
| Service | `auth.service.test.ts` | 7 |
| Store | `copy.store.test.ts` | 9 |
| Store | `image.store.test.ts` | 6 |
| Component | `DsLoading.test.ts` | 5 |
| Component | `DsError.test.ts` | 8 |
| Component | `DsEmpty.test.ts` | 6 |

#### E2E 测试覆盖（3 个文件）

| 文件 | 覆盖 |
|------|------|
| `auth.spec.ts` | 登录页面、mock 登录、navbar 用户信息 |
| `navigation.spec.ts` | 主要页面导航、404 页面 |
| `core-flow.spec.ts` | 文案生成、图片生成、历史记录 |

#### Service 解包修复

所有 service 文件统一修复了 mock API 返回 `ApiResponse<T>` 的解包问题，确保 service 返回给 store 的是解包后的 `T`。

#### 测试文档

| 文件 | 说明 |
|------|------|
| `docs/testing-guide.md` | 测试指南：技术栈、目录结构、运行命令、写法示例 |

### Phase 5：腾讯云服务器部署准备 ✅

#### 环境变量规范化

| 文件 | 变更 |
|------|------|
| `.env.development` | 标准化：`VITE_ENABLE_MOCK=true` |
| `.env.production` | 标准化：`VITE_ENABLE_MOCK=false`，`VITE_API_BASE_URL=/api` |
| `.env.example` | 标准化：完整变量示例 |
| `env.d.ts` | 新增 `VITE_APP_NAME`、`__APP_VERSION__`、`__BUILD_TIME__` 类型 |

#### Vite 构建优化

| 配置项 | 值 |
|--------|-----|
| sourcemap | false |
| chunkSizeWarningLimit | 1000 |
| manualChunks | vendor (vue/vue-router/pinia) + network (axios) |
| define | `__APP_VERSION__` + `__BUILD_TIME__` |

#### 新增配置

| 文件 | 说明 |
|------|------|
| `src/core/config/app.ts` | 应用配置：appName、appEnv、apiBaseUrl、enableMock、appVersion、buildTime |
| `src/core/api/http.ts` | timeout 优化为 15000ms |

#### 腾讯云部署方案

| 文件 | 说明 |
|------|------|
| `docs/tencent-cloud-deployment.md` | 完整部署指南：架构、Nginx 配置、HTTPS、常用命令 |
| `scripts/deploy/tencent-cvm.sh` | 自动化部署脚本（rsync） |
| `docs/release-checklist.md` | 发布检查清单 |

#### GitHub Actions

| 文件 | 说明 |
|------|------|
| `.github/workflows/ci.yml` | CI：build + typecheck + lint + test |
| `.github/workflows/deploy-tencent.yml` | 部署：手动触发，rsync 上传 + Nginx reload |

#### 安全检查

- ✅ 无 console.log 残留
- ✅ 无 Authorization 日志打印
- ✅ localStorage 仅用于 token 管理
- ✅ `.env.production` 中 `VITE_ENABLE_MOCK=false`
- ✅ HTTP timeout 优化为 15s

### Phase 6：产品级细节打磨与上线前 QA ✅

#### QA 检查文档

| 文件 | 说明 |
|------|------|
| `docs/qa-checklist.md` | 上线前 QA 检查清单：基础环境/Auth 流程/逐页检查/移动端/冒烟流程/已知问题 |

#### 页面检查结果

| 页面 | Loading | Error | Empty | 按钮状态 | 表单校验 | 移动端 |
|------|---------|-------|-------|----------|----------|--------|
| home | — | ✅ DsError | ✅ DsEmpty | — | — | ✅ 卡片换行 |
| copy | ✅ DsLoading | ✅ DsError | 内联占位 | ✅ disabled | ✅ 必填 | ✅ 左右布局 |
| image | ✅ DsLoading | ✅ DsError | 内联占位 | ✅ disabled | ✅ 必填 | ✅ 左右布局 |
| article | ✅ DsLoading | ✅ DsError | 内联占位 | ✅ disabled | — | ✅ 左右布局 |
| assets | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | — | — | ✅ 卡片换行 |
| history | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | — | — | ✅ 列表正常 |
| datacenter | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | — | — | ✅ 卡片换行 |
| plugin | ✅ DsLoading | ✅ DsError | ✅ DsEmpty | — | — | ✅ 卡片换行 |
| media | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 | 跳过 |
| login | — | ✅ 内联 | — | ✅ disabled | ✅ 必填 | ✅ 居中 |
| register | — | ✅ 内联 | — | ✅ disabled | ✅ 校验 | ✅ 居中 |
| 404 | — | — | — | ✅ DsButton | — | ✅ 居中 |

#### 移动端适配

| 文件 | 变更 |
|------|------|
| `src/layouts/AuthLayout.vue` | 新增移动端媒体查询：768px 以下隐藏品牌区域，表单全宽 |
| `src/design-system/components/AppNavbar.vue` | 新增移动端媒体查询：768px 以下隐藏导航链接和 logo 文字 |

#### E2E 选择器

| 元素 | data-testid |
|------|-------------|
| 登录提交按钮 | `login-submit` |
| 文案生成按钮 | `copy-generate` |
| 图片生成按钮 | `image-generate` |
| Navbar 用户头像 | `navbar-avatar` |
| Navbar 用户名 | `navbar-username` |

#### Auth 体验检查

- ✅ 登录按钮 loading/disabled 正常
- ✅ 注册按钮 loading/disabled 正常
- ✅ 表单为空时按钮 disabled
- ✅ 错误提示清晰
- ✅ RegisterPage setTimeout 已添加注释说明（UX 跳转，非 mock 模拟）

#### QA 修复（fix/qa-e2e-api-contract）

| 问题 | 修复 |
|------|------|
| E2E 登录按钮选择器误点 navbar | 全部 E2E 改用 `data-testid` 选择器 |
| HTTP 200 但 success=false 未处理 | `http.ts` 响应拦截器新增 `isSuccessResponse` 业务判断 |
| mock getCurrentUser 始终返回默认用户 | `mock.ts` 新增 `currentUser` 跟踪已登录用户 |
| 注册成功跳转 login 与路由守卫冲突 | 改为跳转首页，文案"正在进入首页..." |
| navbar 移动端 .main-content scoped 样式不生效 | 移动样式移到 MainLayout.vue |
| E2E history 测试时序问题 | 等待 loading 结束后再检查 |
| E2E 404 测试选择器错误 | 改用 `.error-code` 和 `.error-title` |

#### 已知问题

| ID | 页面 | 问题 | 优先级 | 状态 |
|----|------|------|--------|------|
| 1 | media | 等待 feature/media-kol 合并后统一检查 | P1 | 待合并 |
| 2 | article | 首次加载无 DsLoading（只有生成时有） | P3 | 已记录 |
| 3 | home | 首页无 DsLoading（只有 error/empty） | P3 | 已记录 |
| 4 | E2E | 登录按钮选择器误点 navbar 按钮 | P0 | ✅ 已修复 |
| 5 | API | HTTP 200 但 success=false 未处理 | P0 | ✅ 已修复 |
| 6 | auth/mock | getCurrentUser 始终返回默认用户 | P1 | ✅ 已修复 |
| 7 | register | 注册成功跳转 login 与路由守卫冲突 | P1 | ✅ 已修复 |
| 8 | navbar | 移动端 .main-content scoped 样式不生效 | P2 | ✅ 已修复 |

---

## 三、验收结果

- ✅ `npm run build` — 0 error
- ✅ `npx vue-tsc --noEmit` — 0 TypeScript error
- ✅ `npx eslint src/` — 0 error
- ✅ `npm run test:unit` — 60 个测试全部通过
- ✅ `npm run test:e2e` — 13 个测试全部通过
- ✅ 所有页面无 mock 直接依赖
- ✅ Service 层完整（10 个模块）
- ✅ API 可替换（enableMock 一键切换）
- ✅ 腾讯云 CVM + Nginx 部署方案就绪
- ✅ 架构无跨层调用
- ✅ QA 检查清单已建立
- ✅ 移动端基础适配完成
- ✅ E2E 关键选择器已添加
- ✅ API 业务失败判断已修复
- ✅ mock 用户一致性已修复

---

## 四、技术栈

- Vue 3.5
- TypeScript 5.6
- Vite 6.0
- Vue Router 4.4
- Pinia 2.2
- Axios 1.7
- ESLint 9.0
- Prettier 3.4

---

## 五、目录结构

```
src/
├── core/           # 核心层
├── design-system/  # 设计系统
├── layouts/        # 布局组件
├── mocks/          # Mock API（统一格式）
├── modules/        # 业务模块
│   └── <module>/
│       ├── page.vue
│       ├── store.ts
│       ├── service.ts
│       ├── api.ts
│       └── types.ts
├── router/         # 路由
└── docs/           # 文档
```

---

## 六、开发规范

详见 [architecture-rules.md](./architecture-rules.md)
