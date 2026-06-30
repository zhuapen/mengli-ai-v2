# Mengli AI Platform V2 — API Contract

> 前后端接口约定文档。后端开发必须严格遵守此文档。

---

## 一、通用响应结构

所有接口统一返回 `ApiResponse<T>` 包裹：

```typescript
interface ApiResponse<T> {
  code: number      // 0 = 成功，非 0 = 错误码
  message: string   // 用户可读提示
  data: T           // 业务数据，无数据时用 null
  success: boolean  // true = 业务成功，false = 业务失败
}
```

**约定：**
- `success=true` 表示业务成功
- `success=false` 表示业务失败
- `code=0` 表示成功
- `message` 用于展示给用户或记录日志
- `data` 必须始终存在；无返回数据时使用 `null` 或空对象

---

## 二、通用错误结构

```typescript
interface ApiError {
  code: number      // HTTP 状态码 或 业务错误码
  message: string   // 用户可读错误信息
  detail?: string   // 调试信息（仅开发环境）
}
```

**错误码枚举：**

| 错误码 | 说明 | 前端处理 |
|--------|------|----------|
| 0 | 成功 | — |
| 401 | 未授权 / token 过期 | 自动清理 token，跳转 /login |
| 403 | 无权限 | 展示"暂无权限访问" |
| 404 | 资源不存在 | 展示"请求资源不存在" |
| 422 | 请求参数错误 | 展示后端返回的 message |
| 500 | 服务器错误 | 展示"服务器错误，请稍后重试" |
| 10000 | 网络异常 | 展示"网络异常，请检查网络连接" |
| 10001 | 未知错误 | 展示"未知错误，请稍后重试" |

---

## 三、分页结构

### 请求参数

```typescript
interface PaginationParams {
  page: number       // 从 1 开始
  pageSize: number   // 默认值由各模块定义
}
```

### 响应结构

```typescript
interface PaginationResult<T> {
  list: T[]          // 数据列表，空时返回 []
  total: number      // 总条数
  page: number       // 当前页
  pageSize: number   // 每页条数
}
```

**约定：**
- `page` 从 1 开始
- `list` 为空时返回 `[]`，不能返回 `null`
- `total` 为总条数

---

## 四、鉴权结构

### 登录返回

```typescript
interface AuthTokens {
  accessToken: string
  refreshToken?: string
}
```

### Token 使用规则

- `accessToken` 放入 `Authorization` header
- 格式：`Bearer <accessToken>`
- token 由 `src/core/auth/token.ts` 统一管理
- 401 时自动清理 token 并跳转 `/login`
- `/auth/me` 用于页面刷新后恢复用户态

---

## 五、接口清单

### Auth 模块

| Method | Path | Request Body | Response Data | 需要登录 |
|--------|------|-------------|---------------|----------|
| POST | /auth/login | `{ email: string, password: string }` | `LoginResponse` | ❌ |
| POST | /auth/register | `{ email: string, password: string }` | `RegisterResponse` | ❌ |
| POST | /auth/logout | — | `null` | ✅ |
| GET | /auth/me | — | `BackendUser` | ✅ |

**LoginResponse（后端返回）：**
```typescript
{
  user: { id: string, email: string, display_name?: string, role: string, status?: string }
  tokens: { accessToken: string, refreshToken?: string }
}
```

**RegisterResponse（后端返回，无 tokens）：**
```typescript
{
  user: { id: string, email: string, display_name?: string, role: string, status?: string }
  message: string  // "注册成功，等待管理员审批"
}
```

**注意：**
- 登录使用 `email` + `password`，不是 `account`
- 注册只返回 `user` + `message`，不返回 `tokens`
- 注册后需要管理员审批，不能直接登录
- 后端用户字段为 `display_name`，前端 service 层转换为 `username`

### Copy 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| POST | /copy/generate | `{ copyType, brand, product, extra? }` | `{ content, version }` | ✅ |
| POST | /copy/refine | `{ content, instruction }` | `{ content, version }` | ✅ |
| GET | /copy/templates | — | `CopyTemplate[]` | ✅ |
| GET | /copy/brands | — | `BrandOption[]` | ✅ |
| GET | /copy/history | — | `CopyHistoryItem[]` | ✅ |

### Image 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| POST | /image/generate | `{ prompt, size, style }` | `{ url, taskId }` | ✅ |
| GET | /image/styles | — | `ImageStyle[]` | ✅ |
| GET | /image/history | — | `ImageHistoryItem[]` | ✅ |

### Media 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /media | `?page=&pageSize=&keyword=&type=` | `PaginationResult<MediaItem>` | ✅ |
| POST | /media/upload | FormData `{ file }` | `MediaItem` | ✅ |
| DELETE | /media/:id | — | `null` | ✅ |
| GET | /media/kols | `?keyword=&platform=&tags=` | `KOL[]` | ✅ |
| GET | /media/platforms | — | `string[]` | ✅ |
| GET | /media/tags | — | `string[]` | ✅ |

### Assets 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /assets | `?page=&pageSize=&keyword=&type=` | `PaginationResult<AssetItem>` | ✅ |
| POST | /assets | `{ title, type, content }` | `AssetItem` | ✅ |
| DELETE | /assets/:id | — | `null` | ✅ |

### History 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /history | `?page=&pageSize=&keyword=&type=` | `PaginationResult<HistoryItem>` | ✅ |
| DELETE | /history/:id | — | `null` | ✅ |
| DELETE | /history | — | `null` | ✅ |

### Article 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| POST | /article/generate | `{ title, mode, requirements?, file? }` | `{ content, mode }` | ✅ |
| POST | /article/upload | FormData `{ file }` | `{ name, size }` | ✅ |
| GET | /article/templates | — | `ArticleTemplate[]` | ✅ |
| GET | /article/drafts | — | `ArticleDraft[]` | ✅ |
| POST | /article/drafts | `{ title, content, id? }` | `ArticleDraft` | ✅ |
| GET | /article/history | `?page=&pageSize=&keyword=` | `PaginationResult<ArticleHistoryItem>` | ✅ |

### Datacenter 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /datacenter/features | — | `DataCenterFeature[]` | ✅ |
| GET | /datacenter/overview | `?range=&startDate=&endDate=` | `DatacenterOverview` | ✅ |
| GET | /datacenter/trends | `?range=&startDate=&endDate=` | `TrendPoint[]` | ✅ |
| GET | /datacenter/channels | `?range=&startDate=&endDate=` | `ChannelMetric[]` | ✅ |
| GET | /datacenter/top-contents | `?range=&startDate=&endDate=` | `TopContentItem[]` | ✅ |

### Plugin 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /plugins | `?page=&pageSize=&keyword=&categoryId=&status=` | `PaginationResult<PluginItem>` | ✅ |
| GET | /plugins/:id | — | `PluginItem` | ✅ |
| GET | /plugins/categories | — | `PluginCategory[]` | ✅ |
| POST | /plugins/:id/enable | — | `PluginItem` | ✅ |
| POST | /plugins/:id/disable | — | `PluginItem` | ✅ |

### Home 模块

| Method | Path | Request Body/Params | Response Data | 需要登录 |
|--------|------|---------------------|---------------|----------|
| GET | /home/case-studies | — | `CaseStudy[]` | ❌ |
| GET | /home/about-items | — | `AboutItem[]` | ❌ |
| GET | /home/overview | — | `HomeOverview` | ✅ |
| GET | /home/recent | — | `HomeRecentItem[]` | ✅ |
| GET | /home/shortcuts | — | `HomeShortcut[]` | ✅ |

---

## 六、数据类型参考

### 通用类型

```typescript
// 时间字段统一使用 ISO 8601 字符串
type ISODateString = string  // e.g. "2026-06-29T14:30:00Z"

// id 统一使用 string
type EntityId = string
```

### Copy 类型

```typescript
interface CopyTemplate {
  id: string
  name: string
  prompt: string
  category: string
}

interface CopyHistoryItem {
  id: string
  copyType: string
  product: string
  content: string
  createdAt: string
}
```

### Image 类型

```typescript
interface ImageStyle {
  id: string       // 'realistic' | 'anime' | 'oil-painting' | 'watercolor' | 'sketch'
  name: string
}

interface ImageHistoryItem {
  id: string
  prompt: string
  style: string
  size: string
  url: string
  createdAt: string
}
```

### Media 类型

```typescript
interface KOL {
  id: string
  name: string
  platform: string
  avatar: string
  followers: number
  engagement: number
  tags: string[]
  price: number
}

interface MediaItem {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  thumbnailUrl?: string
  size: number
  mimeType: string
  createdAt: string
  updatedAt?: string
}
```

### Assets 类型

```typescript
interface AssetItem {
  id: string
  title: string
  type: 'image' | 'copy' | 'article' | 'feedback'
  content: string
  createdAt: string
}
```

### History 类型

```typescript
interface HistoryItem {
  id: string
  type: 'copy' | 'image' | 'article'
  title: string
  content: string
  createdAt: string
}
```

### Article 类型

```typescript
interface ArticleTemplate {
  id: string
  name: string
  description: string
}

interface ArticleDraft {
  id: string
  title: string
  content: string
  updatedAt: string
}

interface ArticleHistoryItem {
  id: string
  title: string
  mode: 'outline' | 'draft'
  content: string
  createdAt: string
}
```

### Datacenter 类型

```typescript
interface DataCenterFeature {
  id: string
  icon: string
  title: string
  description: string
  route: string | null
}

interface MetricCard {
  key: string
  label: string
  value: number
  unit?: string
  changeRate?: number
}

interface TrendPoint {
  date: string
  value: number
  label?: string
}

interface ChannelMetric {
  channel: string
  views: number
  likes: number
  comments: number
  conversionRate?: number
}

interface TopContentItem {
  id: string
  title: string
  type: string
  views: number
  likes: number
  createdAt: string
}
```

### Plugin 类型

```typescript
interface PluginCategory {
  id: string
  name: string
  icon?: string
}

interface PluginItem {
  id: string
  name: string
  description: string
  icon: string
  version: string
  downloads: number
  category: string
}
```

### Home 类型

```typescript
interface CaseStudy {
  id: string
  title: string
  image: string
  description: string
}

interface AboutItem {
  id: string
  title: string
  description: string
}

interface HomeStat {
  key: string
  label: string
  value: number
  unit?: string
  changeRate?: number
}

interface HomeShortcut {
  id: string
  title: string
  description?: string
  route: string
  icon?: string
}

interface HomeRecentItem {
  id: string
  title: string
  type: string
  createdAt: string
  route?: string
}
```

---

## 七、前端调用约定

### api.ts 层

- 只负责 HTTP 请求，不写业务逻辑
- 返回类型为解包后的 `T`（不暴露 `ApiResponse` 包裹）
- 不判断 `enableMock`

### mock.ts 层

- 返回 `ApiResponse<T>` 包裹格式
- 方法名与 api.ts 完全一致
- 模拟延迟只在 mock.ts 中

### service.ts 层

- 判断 `enableMock` 切换数据源
- 负责业务编排、错误转换、日志
- 不写 UI 逻辑

### store.ts 层

- 只调用 service
- 不调用 api/mock
- 管理 loading/error 状态

### page.vue 层

- 只消费 store
- 不 import api/mock/service
