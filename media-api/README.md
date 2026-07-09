# Media API

智能媒体库生产闭环由三部分组成：

1. 网站前端：继续走 `VITE_ENABLE_MOCK=false`，请求真实 `/api/media/*`。
2. `media-api`：轻量 Node + SQLite 服务，负责项目、brief 拆解、采集任务、候选库、推荐结果。
3. 固定采集 worker：运行在已登录蒲公英的电脑上，轮询任务并调用蒲公英采集脚本。

## 本地启动

```bash
npm run media:api
```

健康检查：

```bash
curl http://127.0.0.1:3000/api/media/health
```

Vite 本地开发已通过 `vite.config.ts` 将 `/api` 代理到 `http://localhost:3000`。

## Worker 启动

正式采集电脑需要先登录蒲公英，然后启动：

```bash
MEDIA_API_BASE=https://your-domain.com/api/media \
MEDIA_SERVER_ROOT=https://your-domain.com \
MEDIA_WORKER_TOKEN=change-me \
PGY_RUNNER_PATH=/Users/tulei/Desktop/萌力互动找号本地版-0611/creator-workbench/scripts/run-pgy-task.mjs \
npm run media:worker
```

说明：

- worker 每次只处理一个 queued 任务，避免弹出大量窗口。
- `PGY_RUNNER_PATH` 指向现有蒲公英采集脚本；未配置时，worker 只会检查蒲公英登录并返回明确错误。
- 本地接口烟测可临时设置 `PGY_COLLECTOR_MODE=stub`，但生产不要使用 stub。

## Nginx 示例

```nginx
location /api/media/ {
  proxy_pass http://127.0.0.1:3000/api/media/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

其他现有 `/api/` 路由不要改，避免影响登录、图片生成、文案、历史记录和管理后台。

## 环境变量

- `MEDIA_API_PORT`：media-api 监听端口，默认 `3000`。
- `MEDIA_DB_PATH`：SQLite 文件路径，默认 `media-data/media.sqlite`。
- `MEDIA_WORKER_TOKEN`：worker 调用采集接口的 token。
- `BRIEF_MODEL_BASE_URL`：OpenAI-compatible 模型服务地址。
- `BRIEF_MODEL_API_KEY`：模型 API Key。
- `BRIEF_MODEL_NAME`：brief 拆解模型名。
- `MEDIA_API_BASE`：worker 访问的 media-api 地址。
- `MEDIA_SERVER_ROOT`：兼容旧蒲公英采集脚本的站点根地址。
- `PGY_RUNNER_PATH`：旧蒲公英采集脚本路径。
- `PGY_CHROME_USER_DATA_DIR`：worker Playwright 登录态目录。

## SQLite 备份

建议每天备份：

```bash
mkdir -p backups
cp media-data/media.sqlite "backups/media-$(date +%F-%H%M%S).sqlite"
```

如果开启 WAL，同时备份：

```bash
cp media-data/media.sqlite-wal backups/ 2>/dev/null || true
cp media-data/media.sqlite-shm backups/ 2>/dev/null || true
```

## 回滚

1. 前端回滚到上一版部署包。
2. Nginx 删除或注释 `/api/media/` 转发。
3. 停止 media-api 和 worker。
4. 如需恢复数据，停止 media-api 后用备份 SQLite 覆盖 `MEDIA_DB_PATH`。

## 失败状态

- media-api 未启动：前端显示“媒体后端未接入或未启动”。
- worker 未启动：任务保持 `queued / 等待采集器`。
- 蒲公英未登录：任务显示 `login_required / 蒲公英待登录`。
- 标题或指标抓不到：账号留在候选库或待修复，不进入严格推荐。
