# 上线前 QA 检查清单

> 每次发布前逐项检查，确保无遗漏。

---

## 一、基础环境检查

- [ ] `npm install` 正常
- [ ] `npm run build` 通过（0 error）
- [ ] `npm run test:unit` 全部通过
- [ ] `.env.development` 中 `VITE_ENABLE_MOCK=true`
- [ ] `.env.production` 中 `VITE_ENABLE_MOCK=false`
- [ ] 页面无控制台严重报错

---

## 二、Auth 流程检查

- [ ] `/login` 可访问
- [ ] 登录按钮 loading 正常（disabled + "登录中..."）
- [ ] 登录失败错误提示正常
- [ ] 登录成功跳转首页
- [ ] 刷新页面后能恢复登录态（`restoreSession`）
- [ ] 退出登录正常（token 清理 + 跳转首页）
- [ ] 未登录访问受保护页面跳转 `/login`
- [ ] 已登录访问 `/login` 或 `/register` 跳转首页
- [ ] 401 自动清理 token 并跳转 `/login`

---

## 三、页面检查

### home 首页

- [ ] 首次加载有 loading/error/empty 处理
- [ ] 案例列表正常展示或空状态
- [ ] 关于我们正常展示或空状态
- [ ] 功能卡片可点击跳转
- [ ] 移动端卡片自动换行

### copy 小红书文案

- [ ] 首次加载有 loading 处理
- [ ] 生成按钮 loading/disabled 状态
- [ ] 生成失败有 error 展示
- [ ] 空状态提示"点击生成文案开始创作"
- [ ] 优化按钮 loading/disabled 状态
- [ ] 版本切换正常
- [ ] 复制文案功能正常
- [ ] 移动端左右布局自动切换为上下

### image AI 图片

- [ ] 首次加载有 loading 处理
- [ ] 生成按钮 loading/disabled 状态
- [ ] 生成失败有 error 展示
- [ ] 空状态提示"输入描述后点击生成按钮"
- [ ] 图片预览正常
- [ ] 下载按钮正常
- [ ] 移动端左右布局自动切换为上下

### article 公众号文章

- [ ] 首次加载有 loading 处理
- [ ] 生成按钮 loading/disabled 状态
- [ ] 生成失败有 error 展示
- [ ] 空状态提示"点击生成写稿开始创作"
- [ ] 模式切换（大纲/初稿）正常
- [ ] 复制内容功能正常
- [ ] 移动端左右布局自动切换为上下

### assets 素材库

- [ ] 首次加载有 DsLoading
- [ ] 加载失败有 DsError + retry
- [ ] 空状态有 DsEmpty
- [ ] Tab 切换正常
- [ ] 卡片网格布局正常
- [ ] 移动端卡片自动换行

### history 历史记录

- [ ] 首次加载有 DsLoading
- [ ] 加载失败有 DsError + retry
- [ ] 空状态有 DsEmpty（暂无历史记录）
- [ ] Tab 切换正常
- [ ] 展开/收起详情正常
- [ ] 移动端列表正常

### datacenter 数据中心

- [ ] 首次加载有 DsLoading
- [ ] 加载失败有 DsError + retry
- [ ] 空状态有 DsEmpty
- [ ] 功能卡片可点击跳转
- [ ] 移动端卡片自动换行

### plugin 插件中心

- [ ] 首次加载有 DsLoading
- [ ] 加载失败有 DsError + retry
- [ ] 空状态有 DsEmpty（暂无插件）
- [ ] 插件卡片可点击
- [ ] 移动端卡片自动换行

### media 媒体库

- [ ] 跳过（等待 feature/media-kol 合并后统一检查）

### login 登录页

- [ ] 表单为空时按钮 disabled
- [ ] 登录中按钮 disabled
- [ ] 错误提示清晰
- [ ] 回车键可提交
- [ ] 移动端居中且不溢出

### register 注册页

- [ ] 表单为空时按钮 disabled
- [ ] 注册中按钮 disabled
- [ ] 密码不一致提示正常
- [ ] 密码长度校验正常
- [ ] 注册成功后跳转登录
- [ ] 移动端居中且不溢出

### 404 页面

- [ ] 显示 404 + "页面未找到"
- [ ] 返回首页按钮正常
- [ ] 返回上一页按钮正常
- [ ] 移动端居中且不溢出

---

## 四、移动端检查

| 尺寸 | 设备 | 检查项 |
|------|------|--------|
| 375px | iPhone SE | Navbar 不溢出、表单宽度合理、按钮可点击 |
| 390px | iPhone 14 | 同上 |
| 768px | iPad | 卡片自动换行、左右布局可能切换 |
| 1024px | Small desktop | 正常展示 |
| 1440px | Desktop | 正常展示 |

检查要点：

- [ ] Navbar 不溢出
- [ ] 页面主体 padding 合理
- [ ] 表单宽度合理
- [ ] 卡片自动换行
- [ ] 按钮不挤压
- [ ] 文案不严重溢出
- [ ] 主要操作在移动端可点击

---

## 五、上线前冒烟流程

Mock 模式下至少跑一遍：

1. [ ] 登录（admin / 123456）
2. [ ] 首页打开
3. [ ] copy 生成文案
4. [ ] image 生成图片
5. [ ] history 查看
6. [ ] assets 查看
7. [ ] article 生成或查看
8. [ ] plugin 列表查看
9. [ ] datacenter 查看
10. [ ] 退出登录

---

## 六、已知问题列表

| ID | 页面 | 问题 | 优先级 | 状态 | 负责人 |
|----|------|------|--------|------|--------|
| 1 | media | 等待 feature/media-kol 合并后统一检查 | P1 | 待合并 | — |
| 2 | article | 首次加载无 DsLoading（只有生成时有） | P3 | 已记录 | — |
| 3 | home | 首页无 DsLoading（只有 error/empty） | P3 | 已记录 | — |
| 4 | E2E | 登录按钮选择器误点 navbar 按钮 | P0 | ✅ 已修复 | — |
| 5 | API | HTTP 200 但 success=false 未处理 | P0 | ✅ 已修复 | — |
| 6 | auth/mock | getCurrentUser 始终返回默认用户 | P1 | ✅ 已修复 | — |
| 7 | register | 注册成功跳转 login 与路由守卫冲突 | P1 | ✅ 已修复 | — |
| 8 | navbar | 移动端 .main-content scoped 样式不生效 | P2 | ✅ 已修复 | — |

优先级定义：

- **P0**：阻断上线
- **P1**：影响核心流程
- **P2**：体验问题
- **P3**：优化建议

---

## 七、安全检查

- [ ] 无 console.log 残留
- [ ] 无 Authorization 日志打印
- [ ] localStorage 仅用于 token 管理
- [ ] `.env.production` 中 `VITE_ENABLE_MOCK=false`
- [ ] 不打印 token 内容

---

## 八、部署检查

- [ ] `npm run build` 生成 dist/
- [ ] dist/ 已上传到服务器
- [ ] Nginx root 指向 dist
- [ ] `try_files` fallback 已配置
- [ ] `/api` 反向代理已配置
- [ ] HTTPS 证书有效（如已配置）
