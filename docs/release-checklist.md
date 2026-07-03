# 发布检查清单

> 每次发布前逐项检查，确保无遗漏。

---

## 一、构建检查

- [ ] `npm run build` 通过（0 error）
- [ ] `npx vue-tsc --noEmit` 通过（0 error）
- [ ] `npx eslint src/` 通过（0 error）
- [ ] `npm run test:unit` 全部通过
- [ ] `dist/` 目录已生成

---

## 二、腾讯云服务器检查

- [ ] CVM 正常运行
- [ ] 安全组开放 80 / 443
- [ ] Nginx 已安装并运行
- [ ] `nginx -t` 配置检查通过
- [ ] 域名解析指向服务器 IP
- [ ] `dist/` 已上传到正确目录
- [ ] Nginx `root` 指向 `dist`
- [ ] `try_files $uri $uri/ /index.html` 已配置
- [ ] `/api/` 反向代理已配置

---

## 三、前端运行检查

- [ ] 首页可正常打开
- [ ] 刷新任意路由不 404
- [ ] 登录页可正常打开
- [ ] 登录成功后进入首页
- [ ] Navbar 显示用户信息
- [ ] 退出登录正常
- [ ] 401 自动跳转登录页

---

## 四、API 检查

- [ ] `.env.production` 中 `VITE_API_BASE_URL=/api`
- [ ] `.env.production` 中 `VITE_ENABLE_MOCK=false`
- [ ] `/api` 能正确转发到后端
- [ ] `Authorization: Bearer token` 正常传递
- [ ] 后端 API 可访问

---

## 五、环境变量检查

- [ ] `VITE_APP_NAME` 正确
- [ ] `VITE_APP_ENV=production`
- [ ] `VITE_API_BASE_URL=/api`
- [ ] `VITE_ENABLE_MOCK=false`

---

## 六、回滚策略

### 部署前备份

```bash
# 备份当前 dist
ssh root@YOUR_SERVER_IP "cp -r /var/www/mengli-ai-platform/dist /var/www/mengli-ai-platform/dist.backup.$(date +%Y%m%d%H%M%S)"
```

### 回滚操作

```bash
# 恢复备份
ssh root@YOUR_SERVER_IP "rm -rf /var/www/mengli-ai-platform/dist && mv /var/www/mengli-ai-platform/dist.backup.YYYYMMDDHHMMSS /var/www/mengli-ai-platform/dist"

# 重新加载 Nginx（不要 restart）
ssh root@YOUR_SERVER_IP "sudo systemctl reload nginx"
```

### 注意事项

- 回滚时使用 `reload` 而非 `restart`，避免中断服务
- 新版本异常时优先回滚，再排查问题
- 保留最近 3 次备份

---

## 七、发布后监控

- [ ] 首页加载正常
- [ ] 核心功能可用（登录、文案生成、图片生成）
- [ ] 无控制台报错
- [ ] API 请求正常（Network 面板）
- [ ] 用户反馈无异常

---

## v0.1.0 上线结果（2026-06-30）

### 构建检查
- [x] `npm run build` — 0 error
- [x] `npx vue-tsc --noEmit` — 0 error
- [x] `npx eslint src/` — 0 error
- [x] `npm run test:unit` — 60 passed
- [x] `npm run test:e2e` — 13 passed
- [x] `dist/` 目录已生成

### 腾讯云部署
- [x] CVM 正常运行（43.128.56.10）
- [x] Nginx 已切到 V2 前端
- [x] `nginx -t` 通过
- [x] V2 dist 已上传到 `/var/www/mengli-ai-platform/dist/`
- [x] 旧前端已备份到 `/var/backups/mengli/`
- [x] SPA fallback 正常

### 线上冒烟
- [x] 首页 200
- [x] /login 200
- [x] /register 200
- [x] /copy 200
- [x] /image 200
- [x] /media 200
- [x] /history 200
- [x] /assets 200
- [x] /plugin 200
- [x] /datacenter 200
- [x] /api/ 代理正常（404 来自后端）
- [x] /api/auth/login 代理正常（422 来自后端）

### 待办
- [ ] 真实后端接口联调
- [ ] Mock → API 切换验证
- [ ] 登录全流程验证（需后端就绪）
