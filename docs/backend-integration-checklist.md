# 后端联调 Checklist

> 后端开发完成后，按此文档逐项检查。

---

## 一、环境准备

- [ ] `VITE_API_BASE_URL` 指向后端服务地址
- [ ] `VITE_ENABLE_MOCK=false` 关闭 Mock
- [ ] `.env.production` 默认关闭 Mock
- [ ] 后端 CORS 已配置前端域名
- [ ] 后端健康检查接口可用

---

## 二、Auth 联调（优先级最高）

### 登录

- [ ] `POST /auth/login` 返回 `LoginResult`
- [ ] 返回 `user` + `tokens`
- [ ] `accessToken` 写入 localStorage
- [ ] `refreshToken` 写入 localStorage
- [ ] 登录成功后跳转首页

### Token 使用

- [ ] 请求 header 自动带 `Authorization: Bearer <token>`
- [ ] token 过期后 401 自动清理
- [ ] 401 自动跳转 `/login`

### 恢复登录态

- [ ] `GET /auth/me` 返回当前用户信息
- [ ] 页面刷新后自动调用 `/auth/me` 恢复
- [ ] token 无效时自动退出

### 注册

- [ ] `POST /auth/register` 返回 `RegisterResult`
- [ ] 注册成功后可跳转登录

### 登出

- [ ] `POST /auth/logout` 正常返回
- [ ] 登出后清理本地 token

---

## 三、模块联调顺序

按以下顺序逐模块联调：

### 1. Home 首页

- [ ] `GET /home/case-studies` 返回案例列表
- [ ] `GET /home/about-items` 返回关于我们
- [ ] `GET /home/overview` 返回概览数据
- [ ] `GET /home/recent` 返回最近记录
- [ ] `GET /home/shortcuts` 返回快捷入口

### 2. Copy 文案生成

- [ ] `POST /copy/generate` 生成文案
- [ ] `POST /copy/refine` 优化文案
- [ ] `GET /copy/templates` 获取模板
- [ ] `GET /copy/brands` 获取品牌
- [ ] `GET /copy/history` 获取历史

### 3. Image 图片生成

- [ ] `POST /image/generate` 生成图片
- [ ] `GET /image/styles` 获取风格
- [ ] `GET /image/history` 获取历史

### 4. History 历史记录

- [ ] `GET /history` 分页获取历史
- [ ] `DELETE /history/:id` 删除单条
- [ ] `DELETE /history` 清空全部

### 5. Assets 素材库

- [ ] `GET /assets` 分页获取素材
- [ ] `POST /assets` 创建素材
- [ ] `DELETE /assets/:id` 删除素材

### 6. Media 媒体库

- [ ] `GET /media` 分页获取媒体
- [ ] `POST /media/upload` 上传文件
- [ ] `DELETE /media/:id` 删除媒体
- [ ] `GET /media/kols` 搜索 KOL
- [ ] `GET /media/platforms` 获取平台
- [ ] `GET /media/tags` 获取标签

### 7. Article 公众号写稿

- [ ] `POST /article/generate` 生成文章
- [ ] `POST /article/upload` 上传文件
- [ ] `GET /article/templates` 获取模板
- [ ] `GET /article/drafts` 获取草稿
- [ ] `POST /article/drafts` 保存草稿
- [ ] `GET /article/history` 获取历史

### 8. Datacenter 数据中心

- [ ] `GET /datacenter/features` 获取功能卡片
- [ ] `GET /datacenter/overview` 获取概览
- [ ] `GET /datacenter/trends` 获取趋势
- [ ] `GET /datacenter/channels` 获取渠道
- [ ] `GET /datacenter/top-contents` 获取热门

### 9. Plugin 插件中心

- [ ] `GET /plugins` 分页获取插件
- [ ] `GET /plugins/:id` 获取详情
- [ ] `GET /plugins/categories` 获取分类
- [ ] `POST /plugins/:id/enable` 启用插件
- [ ] `POST /plugins/:id/disable` 禁用插件

---

## 四、每个接口检查项

### 请求

- [ ] Method 一致（GET/POST/PUT/DELETE）
- [ ] Path 一致
- [ ] Request body/query 参数一致
- [ ] Content-Type 正确（JSON / FormData）

### 响应

- [ ] 返回 `ApiResponse<T>` 包裹格式
- [ ] `success` 字段存在
- [ ] `code` / `message` / `data` 字段存在
- [ ] 错误时 `message` 可展示给用户
- [ ] 分页接口返回 `list` / `total` / `page` / `pageSize`
- [ ] 空列表返回 `[]`，不返回 `null`
- [ ] 时间字段统一 ISO 8601 字符串
- [ ] `id` 统一 string 类型

---

## 五、上线前检查

- [ ] `VITE_ENABLE_MOCK=false`
- [ ] `VITE_API_BASE_URL` 指向正式环境
- [ ] `npm run build` 通过
- [ ] `npx vue-tsc --noEmit` 通过
- [ ] `npx eslint src/` 通过
- [ ] 登录 → 刷新 → 退出 → 401 全链路通过
- [ ] 所有页面 Loading / Error / Empty 状态正常
- [ ] 分页功能正常
- [ ] 搜索功能正常
- [ ] 文件上传功能正常

---

## 六、常见问题排查

### 401 循环跳转

检查 token 是否正确写入，`/auth/me` 是否正常返回。

### CORS 错误

检查后端 `Access-Control-Allow-Origin` 配置。

### 数据为空

检查 `data` 字段是否返回 `[]` 而非 `null`。

### 类型不匹配

对照 `docs/api-contract.md` 检查字段名和类型。
