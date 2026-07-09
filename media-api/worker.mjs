#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MEDIA_API_BASE = (process.env.MEDIA_API_BASE || 'http://127.0.0.1:3000/api/media').replace(/\/$/, '')
const SERVER_ROOT = (process.env.MEDIA_SERVER_ROOT || MEDIA_API_BASE.replace(/\/api\/media$/, '')).replace(/\/$/, '')
const WORKER_TOKEN = process.env.MEDIA_WORKER_TOKEN || ''
const POLL_SECONDS = Math.max(2, Number(process.env.MEDIA_WORKER_POLL_SECONDS || 5))
const ONCE = process.argv.includes('--once')
const COLLECTOR_MODE = process.env.PGY_COLLECTOR_MODE || 'live'

const LEGACY_RUNNER_CANDIDATES = [
  process.env.PGY_RUNNER_PATH,
  resolve(__dirname, 'pgy-runner.mjs'),
  '/Users/tulei/Desktop/萌力互动找号本地版-0611/creator-workbench/scripts/run-pgy-task.mjs',
  '/Users/tulei/Desktop/Codex智能工作区/workspace/萌力互动找号本地版-0611/creator-workbench/scripts/run-pgy-task.mjs',
  '/Users/tulei/Documents/萌力ai找号1.0版本/creator-workbench/scripts/run-pgy-task.mjs',
].filter(Boolean)

function sleep(ms) {
  return new Promise(resolveSleep => setTimeout(resolveSleep, ms))
}

async function api(pathname, options = {}) {
  const response = await fetch(`${MEDIA_API_BASE}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(WORKER_TOKEN ? { 'X-Media-Worker-Token': WORKER_TOKEN } : {}),
      ...(options.headers || {}),
    },
  })
  const text = await response.text()
  let payload = {}
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`${MEDIA_API_BASE}${pathname} 返回的不是 JSON`)
  }
  if (!response.ok) throw new Error(payload.message || payload.error || `HTTP ${response.status}`)
  if (payload && typeof payload.success === 'boolean') {
    if (!payload.success) throw new Error(payload.message || 'media-api 返回失败')
    return payload.data
  }
  return payload
}

function resolveLegacyRunner() {
  return LEGACY_RUNNER_CANDIDATES.find(candidate => existsSync(candidate)) || ''
}

async function updateTask(taskId, status, message, extra = {}) {
  const task = await api(`/collector/tasks/${encodeURIComponent(taskId)}/status`, {
    method: 'POST',
    body: JSON.stringify({
      status,
      message,
      ...extra,
    }),
  })
  const suffix = message ? `：${message}` : ''
  console.log(`[worker] ${taskId} ${status}${suffix}`)
  return task
}

function runLegacyRunner(taskId, runnerPath) {
  return new Promise(resolveRun => {
    console.log(`[worker] 调用蒲公英采集脚本：${runnerPath}`)
    const child = spawn(process.execPath, [runnerPath, taskId], {
      cwd: dirname(dirname(runnerPath)),
      env: {
        ...process.env,
        MENGLI_SERVER: SERVER_ROOT,
        MENGLI_PGY_SINGLE_TAB: process.env.MENGLI_PGY_SINGLE_TAB || '1',
      },
      stdio: 'inherit',
    })
    child.on('exit', code => resolveRun(code || 0))
    child.on('error', error => {
      console.error(`[worker] 启动旧采集脚本失败：${error.message}`)
      resolveRun(1)
    })
  })
}

function demoCreators(task) {
  const project = task.project || {}
  const analysis = project.analysis || {}
  const brand = analysis.brand || project.brand || '测试项目'
  return [
    {
      nickname: `${brand}测试达人`,
      xhsId: `demo_${Date.now()}`,
      platform: '小红书蒲公英',
      pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/demo',
      followers: 52000,
      imageQuote: analysis.budgetMin || 5000,
      videoQuote: analysis.budgetMax || analysis.budgetMin || 8000,
      tags: analysis.creatorTypes || [],
      audienceTags: analysis.audienceTags || [],
      titles: Array.from({ length: 30 }, (_, index) => `${brand} 内容标题样例 ${index + 1}`),
      metrics: {
        exposureMedian: 100000,
        readMedian: 12000,
        interactionMedian: 800,
        estimatedCpm: Math.min(analysis.dataThresholds?.cpmMax || 70, 60),
        estimatedReadUnitPrice: 0.5,
        estimatedInteractionUnitPrice: Math.min(analysis.dataThresholds?.cpeMax || 8, 6),
        collectedAt: new Date().toISOString().slice(0, 10),
      },
    },
  ]
}

async function runStub(task) {
  await updateTask(task.id, 'running', 'Stub 模式：生成一条测试候选，用于验证生产接口闭环。')
  await api('/collector/ingest', {
    method: 'POST',
    body: JSON.stringify({
      taskId: task.id,
      status: 'done',
      message: 'Stub 采集完成。正式环境请使用 live 模式和已登录蒲公英的采集脚本。',
      creators: demoCreators(task),
    }),
  })
}

async function probePgyLogin(task) {
  let chromium
  try {
    chromium = (await import('playwright')).chromium
  } catch {
    await updateTask(task.id, 'error', '当前环境未安装 Playwright，无法启动蒲公英采集。请先运行 npm install 或 npx playwright install chromium。')
    return
  }

  const userDataDir = resolve(process.env.PGY_CHROME_USER_DATA_DIR || 'media-data/chrome-profile')
  mkdirSync(userDataDir, { recursive: true })
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: { width: 1440, height: 960 },
    locale: 'zh-CN',
  })
  const page = context.pages()[0] || await context.newPage()
  try {
    await page.goto('https://pgy.xiaohongshu.com/solar/pre-trade/note/kol', { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(1500)
    const text = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '')
    const url = page.url()
    const loginRequired = /login|passport|signin/i.test(url) || (/登录|扫码|验证码/.test(text) && !/找博主|博主类目|合作目标/.test(text))
    if (loginRequired) {
      await updateTask(task.id, 'login_required', '固定采集电脑尚未登录蒲公英。请在弹出的 Chrome 登录后重新刷新任务状态。')
      return
    }
    await updateTask(task.id, 'error', '已确认蒲公英登录，但未配置可执行采集脚本。请设置 PGY_RUNNER_PATH 指向 run-pgy-task.mjs。')
  } finally {
    await context.close().catch(() => {})
  }
}

async function runTask(task) {
  if (COLLECTOR_MODE === 'stub') {
    await runStub(task)
    return
  }

  const runnerPath = resolveLegacyRunner()
  if (runnerPath) {
    await updateTask(task.id, 'running', '固定 worker 已接收任务，开始调用蒲公英采集脚本。')
    const code = await runLegacyRunner(task.id, runnerPath)
    if (code !== 0) {
      await updateTask(task.id, 'error', `蒲公英采集脚本退出码 ${code}。请查看 worker 终端日志。`)
    }
    return
  }

  await probePgyLogin(task)
}

async function main() {
  console.log(`[worker] media api: ${MEDIA_API_BASE}`)
  console.log(`[worker] server root: ${SERVER_ROOT}`)
  console.log(`[worker] mode: ${COLLECTOR_MODE}`)
  while (true) {
    try {
      const task = await api('/collector/tasks/next')
      if (task?.id) {
        await runTask(task)
      } else if (ONCE) {
        console.log('[worker] 没有 queued 任务，退出。')
        return
      } else {
        process.stdout.write('.')
        await sleep(POLL_SECONDS * 1000)
      }
    } catch (error) {
      console.error(`\n[worker] ${error instanceof Error ? error.message : String(error)}`)
      if (ONCE) process.exit(1)
      await sleep(Math.max(POLL_SECONDS, 10) * 1000)
    }
  }
}

main().catch(error => {
  console.error(`[worker] 启动失败：${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
