import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const PORT = Number(process.env.MEDIA_API_PORT || process.env.PORT || 3000)
const DB_PATH = resolve(process.env.MEDIA_DB_PATH || 'media-data/media.sqlite')
const MODEL_BASE_URL = process.env.BRIEF_MODEL_BASE_URL || 'https://api.openai.com/v1'
const MODEL_API_KEY = process.env.BRIEF_MODEL_API_KEY || ''
const MODEL_NAME = process.env.BRIEF_MODEL_NAME || 'gpt-4.1-mini'
const WORKER_TOKEN = process.env.MEDIA_WORKER_TOKEN || ''

mkdirSync(dirname(DB_PATH), { recursive: true })

const db = new DatabaseSync(DB_PATH)
db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS media_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    target_count INTEGER NOT NULL,
    platforms_json TEXT NOT NULL,
    budget_min INTEGER,
    budget_max INTEGER,
    status TEXT NOT NULL,
    brief TEXT NOT NULL,
    analysis_json TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media_collection_tasks (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    status TEXT NOT NULL,
    target_count INTEGER NOT NULL,
    collected_count INTEGER NOT NULL DEFAULT 0,
    candidate_count INTEGER NOT NULL DEFAULT 0,
    message TEXT NOT NULL,
    started_at TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media_creators (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    xhs_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    pgy_home_url TEXT NOT NULL,
    followers INTEGER NOT NULL DEFAULT 0,
    image_quote INTEGER,
    video_quote INTEGER,
    rebate_percent REAL,
    contact TEXT,
    tags_json TEXT NOT NULL,
    audience_tags_json TEXT NOT NULL,
    titles_collected INTEGER NOT NULL DEFAULT 0,
    title_status TEXT NOT NULL,
    title_error TEXT,
    metric_status TEXT NOT NULL,
    metric_error TEXT,
    metrics_json TEXT NOT NULL,
    quote_updated_at TEXT,
    data_updated_at TEXT,
    source_project TEXT,
    entry_status TEXT NOT NULL,
    selected_by_client INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    UNIQUE(xhs_id, platform)
  );

  CREATE TABLE IF NOT EXISTS media_creator_titles (
    id TEXT PRIMARY KEY,
    creator_id TEXT NOT NULL,
    title TEXT NOT NULL,
    published_at TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS media_recommendations (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    tier TEXT NOT NULL,
    score INTEGER NOT NULL,
    requirement_hits_json TEXT NOT NULL,
    title_match_summary TEXT NOT NULL,
    risk_notes_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(project_id, creator_id)
  );

  CREATE TABLE IF NOT EXISTS media_model_logs (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    success INTEGER NOT NULL,
    error TEXT,
    created_at TEXT NOT NULL
  );
`)

const json = value => JSON.stringify(value ?? null)
const parseJson = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const ok = data => ({ code: 0, message: 'success', success: true, data })
const fail = (message, code = 400, data = null) => ({ code, message, success: false, data })
const now = () => new Date().toISOString()
const today = () => now().slice(0, 10)
const unique = values => Array.from(new Set(values.map(value => String(value).trim()).filter(Boolean)))
const includesAny = (text, terms) => terms.some(term => text.includes(term))
const numberValue = value => (value === undefined || value === null || value === '' ? undefined : Number(value))

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = ''
    request.on('data', chunk => {
      body += chunk
      if (body.length > 2_000_000) {
        request.destroy()
        rejectBody(new Error('请求体过大'))
      }
    })
    request.on('end', () => {
      if (!body) {
        resolveBody({})
        return
      }
      try {
        resolveBody(JSON.parse(body))
      } catch {
        rejectBody(new Error('请求 JSON 格式错误'))
      }
    })
  })
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Media-Worker-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  })
  response.end(JSON.stringify(payload))
}

function requireWorker(request, response) {
  if (!WORKER_TOKEN) return true
  const headerToken = request.headers['x-media-worker-token']
  if (headerToken === WORKER_TOKEN) return true
  send(response, 401, fail('worker token 无效', 401))
  return false
}

function normalizePlatform(platforms) {
  if (Array.isArray(platforms) && platforms.length > 0) return platforms
  return ['小红书蒲公英']
}

function buildRuleAnalysis(brief, provider = 'local-rules') {
  const text = String(brief || '')
  const isWolong = includesAny(text, ['沃隆', '坚果', '零食', '美食'])
  const isYoga = includesAny(text, ['YOGA', 'yoga', '电脑', '笔记本', '轻薄本', '国补'])
  const isMoto = includesAny(text, ['moto', 'razr', '折叠屏', '情人节', '情侣', '礼物'])
  const targetCount = extractTargetCount(text, isWolong ? 25 : isYoga ? 50 : isMoto ? 20 : 10)
  const budget = extractBudget(text)
  const thresholds = extractThresholds(text)

  if (isWolong) {
    return {
      brand: '沃隆',
      targetCount,
      platforms: ['小红书蒲公英'],
      budgetMin: budget.min ?? 5000,
      budgetMax: budget.max ?? 10000,
      cooperationForm: ['报备图文', '报备视频优先'],
      creatorTypes: ['美食种草类', '美食开箱测评类'],
      audienceTags: ['上班族', '学生党', '养生党', '精致妈妈'],
      excludedTags: [],
      contentAngles: ['坚果零食', '开箱测评', '办公室零食', '健康零食'],
      fanRanges: [{ label: '按预算和数据优先', min: 10000 }],
      dataThresholds: { cpmMax: thresholds.cpmMax ?? 70, cpeMax: thresholds.cpeMax ?? 8 },
      hardRequirements: ['平台为小红书蒲公英', '单个预算 5000-10000', 'CPM 小于 70', 'CPE 小于 8'],
      flexibleRequirements: ['视频优先', '返点暂不参与自动推荐'],
      searchKeywords: ['美食种草', '坚果零食', '办公室零食', '零食测评'],
      synonymKeywords: ['小零嘴', '下午茶', '健康零食', '试吃', '开箱'],
      productKeywords: ['沃隆', '坚果', '每日坚果'],
      pgyFilterPlan: {
        resetBeforeApply: true,
        primaryCategories: ['美食'],
        subCategories: ['美食测评', '美食展示', '美食教程', '美食其他'],
        mappedFilters: [
          { group: '博主类目', field: '主类目', values: ['美食'], reason: 'brief 明确要求美食种草和开箱测评' },
          { group: '合作笔记', field: '合作报价', values: ['图文/视频 5000-10000'], reason: '先排除明显超预算账号' },
          { group: '数据表现', field: '预估CPM/预估互动单价', values: ['CPM < 70', 'CPE < 8'], reason: 'brief 给出明确数据要求' },
        ],
        supplementSearch: ['沃隆坚果', '坚果开箱', '办公室零食'],
        validationWarnings: ['每次采集前必须重置蒲公英筛选，禁止继承上一轮项目条件'],
      },
      questions: ['四类人群标签是否需要平均分配提报数量？', '视频报价缺失但图文数据优秀的达人是否可做备选？'],
      summary: '以小红书蒲公英美食类为主，先锁定预算和CPM/CPE，再用标题判断坚果、零食、开箱测评及人群覆盖。',
      sourceProvider: provider,
    }
  }

  if (isYoga) {
    return {
      brand: 'YOGA电脑',
      targetCount,
      platforms: ['小红书蒲公英'],
      budgetMin: budget.min ?? 2000,
      budgetMax: budget.max ?? 4000,
      cooperationForm: ['图文报备', '供稿直发'],
      creatorTypes: ['科技数码', '职场白领', '高质感生活方式'],
      audienceTags: ['白领', '都市青年'],
      excludedTags: ['学生群体', '擦边', '断更30天'],
      contentAngles: ['办公效率', '轻薄本', '国补', '职场桌搭'],
      fanRanges: [{ label: 'KOC', min: 20000, max: 50000, ratio: 1 }],
      dataThresholds: thresholds,
      hardRequirements: ['平台为小红书蒲公英', '粉丝量 2w-5w', '图文报价 2000-4000'],
      flexibleRequirements: ['同类电脑/办公标题优先', '无数据阈值时按合作数据排序'],
      searchKeywords: ['YOGA电脑', '笔记本电脑', '轻薄本', '职场桌搭'],
      synonymKeywords: ['办公好物', '职场装备', '高质感桌面', '通勤办公'],
      productKeywords: ['YOGA', '联想电脑', '笔记本电脑', '轻薄本'],
      pgyFilterPlan: {
        resetBeforeApply: true,
        primaryCategories: ['科技数码', '职场', '生活记录', '时尚'],
        subCategories: ['移动数码', '数码测评', '电脑测评', '职场生活', '桌面搭配', '白领穿搭'],
        mappedFilters: [
          { group: '博主类目', field: '主类目', values: ['科技数码', '职场', '生活记录', '时尚'], reason: 'brief 同时要求电脑、白领、高质感场景' },
          { group: '粉丝画像', field: '粉丝量', values: ['2万-5万'], reason: 'brief 指定 KOC 粉丝量' },
          { group: '常规排除', field: '排除项', values: ['低活博主', '掉粉博主'], excludeValues: ['学生群体', '擦边'], reason: '排除不符合 YOGA 人群的账号' },
        ],
        supplementSearch: ['YOGA电脑', '国补笔记本', '轻薄本测评'],
        validationWarnings: ['不得把食品、美妆等无关主类目混入首轮筛选'],
      },
      questions: ['粉丝量是否必须限定 2w-5w，还是报价和内容更优可放宽？', '时尚高质感是否只接受非性感/非擦边账号？'],
      summary: '以科技数码和职场白领账号为主，粉丝量和报价先硬筛，再排除学生、擦边、断更账号。',
      sourceProvider: provider,
    }
  }

  return {
    brand: isMoto ? '联想moto razr 50 系列折叠屏手机' : extractBrand(text),
    targetCount,
    platforms: ['小红书蒲公英'],
    budgetMin: budget.min,
    budgetMax: budget.max,
    cooperationForm: ['待确认'],
    creatorTypes: isMoto ? ['情侣生活', '高质感数码礼物', '情人节场景'] : ['待确认'],
    audienceTags: isMoto ? ['情侣', '礼物决策人群'] : [],
    excludedTags: isMoto ? ['擦边', '搬运内容'] : [],
    contentAngles: isMoto ? ['情人节礼物', '折叠屏手机', '高颜值数码'] : [],
    fanRanges: [{ label: '按预算和内容匹配优先' }],
    dataThresholds: thresholds,
    hardRequirements: ['平台为小红书蒲公英'],
    flexibleRequirements: ['同类内容标题优先'],
    searchKeywords: isMoto ? ['moto razr 50', '折叠屏手机', '情人节礼物'] : [],
    synonymKeywords: isMoto ? ['数码礼物', '情侣礼物', '高颜值手机'] : [],
    productKeywords: isMoto ? ['moto razr 50', '折叠屏'] : [],
    pgyFilterPlan: {
      resetBeforeApply: true,
      primaryCategories: isMoto ? ['情感', '生活记录', '科技数码', '时尚'] : ['小红书蒲公英'],
      subCategories: isMoto ? ['情侣', '礼物', '好物分享', '数码测评', '高质感生活'] : [],
      mappedFilters: [
        { group: '博主类目', field: '主类目', values: isMoto ? ['情感', '生活记录', '科技数码', '时尚'] : ['待确认'], reason: '按 brief 场景限制首轮类目' },
      ],
      supplementSearch: isMoto ? ['moto razr 50', '情人节数码礼物'] : [],
      validationWarnings: ['每次采集前必须重置蒲公英筛选，禁止继承上一轮项目条件'],
    },
    questions: isMoto ? ['是否接受非情侣号但能自然做情人节礼物内容的账号？'] : ['是否需要补充达人类型、预算或平台？'],
    summary: isMoto
      ? '以情感生活和高质感数码礼物账号为主，补充搜索moto与情人节礼物内容，排除擦边和低质搬运。'
      : 'brief 信息较少，建议先补充达人类型、预算、平台和数据要求后再采集。',
    sourceProvider: provider,
  }
}

function extractBrand(text) {
  const match = text.match(/【品牌】\s*([^\n\r]+)/)
  return match ? match[1].trim() : '未写明'
}

function extractTargetCount(text, fallback) {
  const matches = [...text.matchAll(/(?:提报数量不低于|先给|需提报|推荐数量|计划推广数量)[^\d]{0,8}(\d+)/g)]
  if (matches[0]) return Number(matches[0][1])
  const simple = text.match(/(\d+)\s*个/)
  return simple ? Number(simple[1]) : fallback
}

function parseMoney(value, unit = '') {
  const number = Number(value)
  if (unit.includes('w') || unit.includes('万')) return Math.round(number * 10000)
  if (unit.includes('k') || unit.includes('K')) return Math.round(number * 1000)
  return Math.round(number)
}

function extractBudget(text) {
  const range = text.match(/(\d+(?:\.\d+)?)([kK万wW]?)\s*[-—~到]\s*(\d+(?:\.\d+)?)([kK万wW]?)/)
  if (range) {
    return {
      min: parseMoney(range[1], range[2] || range[4]),
      max: parseMoney(range[3], range[4] || range[2]),
    }
  }
  return {}
}

function extractThresholds(text) {
  const cpm = text.match(/CPM\s*[<＜]\s*(\d+(?:\.\d+)?)/i)
  const cpe = text.match(/CPE\s*[<＜]\s*(\d+(?:\.\d+)?)/i)
  return {
    cpmMax: cpm ? Number(cpm[1]) : undefined,
    cpeMax: cpe ? Number(cpe[1]) : undefined,
  }
}

async function analyzeWithModel(brief, provider, revisionNotes) {
  if (!MODEL_API_KEY) return null
  const prompt = [
    '你是萌力互动内部选号系统的 brief 拆解助手。',
    '只输出 JSON，不要输出 Markdown。',
    '字段必须匹配：brand,targetCount,platforms,budgetMin,budgetMax,cooperationForm,creatorTypes,audienceTags,excludedTags,contentAngles,fanRanges,dataThresholds,hardRequirements,flexibleRequirements,searchKeywords,synonymKeywords,productKeywords,pgyFilterPlan,questions,summary,sourceProvider。',
    '只保留影响选号筛选的问题；发布排期、挂链、寄样、审稿等执行信息只放 flexibleRequirements，不要放 questions。',
    `brief:\n${brief}`,
    revisionNotes?.length ? `revisionNotes:\n${revisionNotes.join('\n')}` : '',
  ].join('\n\n')

  const response = await fetch(`${MODEL_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MODEL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You return strict JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`模型接口失败：${response.status} ${text.slice(0, 160)}`)
  }

  const payload = await response.json()
  const content = payload.choices?.[0]?.message?.content
  if (!content) throw new Error('模型未返回内容')
  return JSON.parse(content)
}

function normalizeAnalysis(analysis, brief, provider) {
  const rule = buildRuleAnalysis(brief, provider)
  const merged = {
    ...rule,
    ...analysis,
    pgyFilterPlan: {
      ...rule.pgyFilterPlan,
      ...(analysis?.pgyFilterPlan || {}),
    },
    sourceProvider: analysis?.sourceProvider || provider,
  }

  const isFood = includesAny(brief, ['沃隆', '坚果', '零食', '美食'])
  const isYoga = includesAny(brief, ['YOGA', 'yoga', '电脑', '笔记本', '轻薄本', '国补'])
  const isMoto = includesAny(brief, ['moto', 'razr', '折叠屏', '情人节', '情侣', '礼物'])

  if (isFood) {
    merged.pgyFilterPlan.primaryCategories = ['美食']
    merged.pgyFilterPlan.subCategories = ['美食测评', '美食展示', '美食教程', '美食其他']
  } else if (isYoga) {
    merged.pgyFilterPlan.primaryCategories = ['科技数码', '职场', '生活记录', '时尚']
  } else if (isMoto) {
    merged.pgyFilterPlan.primaryCategories = ['情感', '生活记录', '科技数码', '时尚']
  }

  merged.pgyFilterPlan.resetBeforeApply = true
  merged.pgyFilterPlan.validationWarnings = unique([
    ...(merged.pgyFilterPlan.validationWarnings || []),
    '每次采集前必须重置蒲公英筛选，禁止继承上一轮项目条件',
  ])
  merged.questions = unique((merged.questions || []).filter(question => !includesAny(question, ['发布', '排期', '寄样', '审稿', '链接上线'])))
  return merged
}

async function briefIntelligence(body) {
  const brief = String(body.brief || '').trim()
  if (!brief) throw new Error('brief 不能为空')

  const provider = body.provider || process.env.BRIEF_MODEL_PROVIDER || 'compatible'
  let analysis = null
  let error = null

  try {
    analysis = await analyzeWithModel(brief, provider, body.revisionNotes || [])
  } catch (modelError) {
    error = modelError instanceof Error ? modelError.message : String(modelError)
  }

  const normalized = normalizeAnalysis(analysis, brief, error ? 'local-rules' : provider)
  db.prepare('INSERT INTO media_model_logs (id, provider, model, success, error, created_at) VALUES (?, ?, ?, ?, ?, ?)').run(
    randomUUID(),
    provider,
    MODEL_NAME,
    error ? 0 : 1,
    error,
    now(),
  )
  return normalized
}

function rowToProject(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    targetCount: row.target_count,
    platforms: parseJson(row.platforms_json, []),
    budgetMin: numberValue(row.budget_min),
    budgetMax: numberValue(row.budget_max),
    status: row.status,
    brief: row.brief,
    analysis: parseJson(row.analysis_json, undefined),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function rowToCreator(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    xhsId: row.xhs_id,
    platform: row.platform,
    pgyHomeUrl: row.pgy_home_url,
    followers: row.followers,
    imageQuote: numberValue(row.image_quote),
    videoQuote: numberValue(row.video_quote),
    rebatePercent: numberValue(row.rebate_percent),
    contact: row.contact || undefined,
    tags: parseJson(row.tags_json, []),
    audienceTags: parseJson(row.audience_tags_json, []),
    titlesCollected: row.titles_collected,
    titleStatus: row.title_status,
    titleError: row.title_error || undefined,
    metricStatus: row.metric_status,
    metricError: row.metric_error || undefined,
    metrics: parseJson(row.metrics_json, {}),
    quoteUpdatedAt: row.quote_updated_at || undefined,
    dataUpdatedAt: row.data_updated_at || undefined,
    sourceProject: row.source_project || undefined,
    entryStatus: row.entry_status,
    selectedByClient: Boolean(row.selected_by_client),
    updatedAt: row.updated_at,
  }
}

function rowToTask(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    status: row.status,
    targetCount: row.target_count,
    collectedCount: row.collected_count,
    candidateCount: row.candidate_count,
    message: row.message,
    startedAt: row.started_at || undefined,
    updatedAt: row.updated_at,
  }
}

function upsertProject(project) {
  db.prepare(`
    INSERT INTO media_projects (id, name, brand, target_count, platforms_json, budget_min, budget_max, status, brief, analysis_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      brand=excluded.brand,
      target_count=excluded.target_count,
      platforms_json=excluded.platforms_json,
      budget_min=excluded.budget_min,
      budget_max=excluded.budget_max,
      status=excluded.status,
      brief=excluded.brief,
      analysis_json=excluded.analysis_json,
      updated_at=excluded.updated_at
  `).run(
    project.id,
    project.name,
    project.brand,
    project.targetCount,
    json(project.platforms),
    project.budgetMin ?? null,
    project.budgetMax ?? null,
    project.status,
    project.brief,
    json(project.analysis),
    project.createdAt,
    project.updatedAt,
  )
}

function createProject(body) {
  const analysis = body.analysis || null
  const timestamp = now()
  const project = {
    id: body.id || `project_${randomUUID().slice(0, 12)}`,
    name: body.name || `${analysis?.brand || '新项目'} 选号项目`,
    brand: body.brand || analysis?.brand || '未写明',
    targetCount: Number(body.targetCount || analysis?.targetCount || 10),
    platforms: normalizePlatform(body.platforms || analysis?.platforms),
    budgetMin: numberValue(body.budgetMin ?? analysis?.budgetMin),
    budgetMax: numberValue(body.budgetMax ?? analysis?.budgetMax),
    status: body.status || (analysis ? 'analyzed' : 'draft'),
    brief: String(body.brief || ''),
    analysis,
    createdAt: body.createdAt || timestamp,
    updatedAt: timestamp,
  }
  upsertProject(project)
  return project
}

function listProjects() {
  return db.prepare('SELECT * FROM media_projects ORDER BY updated_at DESC').all().map(rowToProject)
}

function createTask(body) {
  const timestamp = now()
  const project = db.prepare('SELECT * FROM media_projects WHERE id = ?').get(body.projectId)
  if (!project) throw new Error('项目不存在，请先保存项目')

  const task = {
    id: `codex_${randomUUID().replace(/-/g, '').slice(0, 16)}`,
    projectId: body.projectId,
    status: 'queued',
    targetCount: Number(body.targetCount || body.analysis?.targetCount || project.target_count || 10),
    collectedCount: 0,
    candidateCount: 0,
    message: '后台采集器已接收任务，等待固定 worker 处理。',
    startedAt: undefined,
    updatedAt: timestamp,
  }

  db.prepare(`
    INSERT INTO media_collection_tasks (id, project_id, status, target_count, collected_count, candidate_count, message, started_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(task.id, task.projectId, task.status, task.targetCount, task.collectedCount, task.candidateCount, task.message, null, task.updatedAt)
  db.prepare('UPDATE media_projects SET status = ?, updated_at = ? WHERE id = ?').run('collecting', timestamp, body.projectId)
  return task
}

function getTask(id) {
  const row = db.prepare('SELECT * FROM media_collection_tasks WHERE id = ?').get(id)
  return row ? rowToTask(row) : null
}

function nextTask() {
  const row = db.prepare("SELECT * FROM media_collection_tasks WHERE status = 'queued' ORDER BY updated_at ASC LIMIT 1").get()
  if (!row) return null
  const project = db.prepare('SELECT * FROM media_projects WHERE id = ?').get(row.project_id)
  return {
    ...rowToTask(row),
    project: project ? rowToProject(project) : null,
  }
}

function updateTaskStatus(id, body) {
  const current = getTask(id)
  if (!current) throw new Error('任务不存在')
  const timestamp = now()
  const status = body.status || current.status
  db.prepare(`
    UPDATE media_collection_tasks
    SET status = ?, collected_count = ?, candidate_count = ?, message = ?, started_at = COALESCE(started_at, ?), updated_at = ?
    WHERE id = ?
  `).run(
    status,
    Number(body.collectedCount ?? current.collectedCount),
    Number(body.candidateCount ?? current.candidateCount),
    body.message || current.message,
    status === 'running' ? timestamp : current.startedAt || null,
    timestamp,
    id,
  )
  if (['running', 'queued'].includes(status)) {
    db.prepare('UPDATE media_projects SET status = ?, updated_at = ? WHERE id = ?').run('collecting', timestamp, current.projectId)
  }
  if (status === 'login_required' || status === 'error') {
    db.prepare('UPDATE media_projects SET status = ?, updated_at = ? WHERE id = ?').run('needs_review', timestamp, current.projectId)
  }
  if (status === 'done') {
    db.prepare('UPDATE media_projects SET status = ?, updated_at = ? WHERE id = ?').run('ready', timestamp, current.projectId)
  }
  return getTask(id)
}

function listCreators(params) {
  const rows = db.prepare('SELECT * FROM media_creators ORDER BY updated_at DESC').all()
  return rows.map(rowToCreator).filter(creator => {
    const keyword = params.get('keyword')
    const platform = params.get('platform')
    const entryStatus = params.get('entryStatus')
    const text = `${creator.nickname} ${creator.xhsId} ${creator.tags.join(' ')} ${creator.audienceTags.join(' ')}`
    if (keyword && !text.includes(keyword)) return false
    if (platform && platform !== '全部' && creator.platform !== platform) return false
    if (entryStatus && entryStatus !== '全部入库状态' && creator.entryStatus !== entryStatus) return false
    return true
  })
}

function queryList(params, name) {
  return unique(
    [...params.getAll(name), ...params.getAll(`${name}[]`)]
      .flatMap(value => value.split(',')),
  )
}

function queryNumber(params, name) {
  const value = params.get(name)
  if (value === null || value.trim() === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function listKols(params) {
  const requestedTags = queryList(params, 'tags')
  const minFollowers = queryNumber(params, 'minFollowers')
  const maxFollowers = queryNumber(params, 'maxFollowers')
  const minQuote = queryNumber(params, 'minQuote')
  const maxQuote = queryNumber(params, 'maxQuote')
  const minRebate = queryNumber(params, 'minRebate')
  const maxRebate = queryNumber(params, 'maxRebate')

  return listCreators(params)
    .filter(creator => {
      const creatorTags = [...creator.tags, ...creator.audienceTags]
      const quote = creator.videoQuote ?? creator.imageQuote ?? 0
      const rebate = creator.rebatePercent ?? 0
      if (requestedTags.length > 0 && !requestedTags.some(tag => creatorTags.includes(tag))) return false
      if (minFollowers !== undefined && creator.followers < minFollowers) return false
      if (maxFollowers !== undefined && creator.followers > maxFollowers) return false
      if (minQuote !== undefined && quote < minQuote) return false
      if (maxQuote !== undefined && quote > maxQuote) return false
      if (minRebate !== undefined && rebate < minRebate) return false
      if (maxRebate !== undefined && rebate > maxRebate) return false
      return true
    })
    .map(creator => ({
      id: creator.id,
      name: creator.nickname,
      platform: creator.platform,
      avatar: creator.nickname.slice(0, 1),
      followers: creator.followers,
      engagement: creator.metrics.interactionMedian ?? 0,
      tags: [...creator.tags, ...creator.audienceTags],
      price: creator.videoQuote ?? creator.imageQuote ?? 0,
    }))
}

function normalizeCreator(input, projectName) {
  const metrics = input.metrics || {
    exposureMedian: numberValue(input.exposureMedian ?? input.exposure_median),
    readMedian: numberValue(input.readMedian ?? input.read_median),
    interactionMedian: numberValue(input.interactionMedian ?? input.interaction_median),
    estimatedCpm: numberValue(input.estimatedCpm ?? input.estimated_cpm),
    estimatedReadUnitPrice: numberValue(input.estimatedReadUnitPrice ?? input.estimated_read_unit_price),
    estimatedInteractionUnitPrice: numberValue(input.estimatedInteractionUnitPrice ?? input.estimated_interaction_unit_price),
    collectedAt: input.dataUpdatedAt || input.data_updated_at || today(),
  }
  const titles = Array.isArray(input.titles)
    ? input.titles
    : Array.isArray(input.recentTitles)
      ? input.recentTitles
      : Array.isArray(input.recent_titles)
        ? input.recent_titles
        : []
  const titleCount = Number(input.titlesCollected ?? titles.length ?? 0)
  const timestamp = now()
  return {
    id: input.id || `creator_${randomUUID().slice(0, 12)}`,
    nickname: input.nickname || input.name || '未命名达人',
    xhsId: input.xhsId || input.xhs_id || input.platformId || input.platform_id || '',
    platform: normalizeCreatorPlatform(input.platform),
    pgyHomeUrl: input.pgyHomeUrl || input.pgy_home_url || input.homeUrl || input.home_url || '',
    followers: Number(input.followers || 0),
    imageQuote: numberValue(input.imageQuote ?? input.image_quote),
    videoQuote: numberValue(input.videoQuote ?? input.video_quote),
    rebatePercent: numberValue(input.rebatePercent ?? input.rebate_percent),
    contact: input.contact || undefined,
    tags: unique(input.tags || input.content_tags || []),
    audienceTags: unique(input.audienceTags || input.audience_tags || []),
    titlesCollected: titleCount,
    titleStatus: input.titleStatus || (titleCount >= 30 ? 'collected' : titleCount > 0 ? 'partial' : 'missing'),
    titleError: input.titleError || (titleCount >= 30 ? undefined : `标题不足（${titleCount}/30）`),
    metricStatus: normalizeMetricStatus(input.metricStatus || input.metric_status, metrics),
    metricError: input.metricError || input.metric_error,
    metrics,
    quoteUpdatedAt: input.quoteUpdatedAt || input.quote_collected_at || today(),
    dataUpdatedAt: input.dataUpdatedAt || input.data_collected_at || today(),
    sourceProject: input.sourceProject || projectName,
    entryStatus: input.entryStatus || (input.rebatePercent && input.contact ? '正式入库' : '候选库'),
    selectedByClient: Boolean(input.selectedByClient),
    updatedAt: timestamp,
    titles,
  }
}

function inferMetricStatus(metrics) {
  const values = ['exposureMedian', 'readMedian', 'interactionMedian', 'estimatedCpm', 'estimatedInteractionUnitPrice']
  const collected = values.filter(key => metrics[key] !== undefined && metrics[key] !== null)
  if (collected.length >= 4) return 'official'
  if (collected.length > 0) return 'partial'
  return 'official_unavailable'
}

function normalizeMetricStatus(status, metrics) {
  if (status === 'collected') return 'official'
  if (status === 'unavailable') return 'official_unavailable'
  if (status === 'missing') return inferMetricStatus(metrics)
  if (['official', 'official_unavailable', 'partial', 'failed'].includes(status)) return status
  return inferMetricStatus(metrics)
}

function normalizeCreatorPlatform(platform) {
  if (!platform || platform === 'pgy' || platform === '蒲公英') return '小红书蒲公英'
  return platform
}

function upsertCreator(creator) {
  if (!creator.xhsId || !creator.pgyHomeUrl) {
    creator.entryStatus = '待修复'
    creator.metricError = creator.metricError || '缺小红书号或蒲公英主页链接'
  }

  db.prepare(`
    INSERT INTO media_creators (
      id, nickname, xhs_id, platform, pgy_home_url, followers, image_quote, video_quote, rebate_percent, contact,
      tags_json, audience_tags_json, titles_collected, title_status, title_error, metric_status, metric_error,
      metrics_json, quote_updated_at, data_updated_at, source_project, entry_status, selected_by_client, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(xhs_id, platform) DO UPDATE SET
      nickname=excluded.nickname,
      pgy_home_url=excluded.pgy_home_url,
      followers=excluded.followers,
      image_quote=excluded.image_quote,
      video_quote=excluded.video_quote,
      rebate_percent=COALESCE(excluded.rebate_percent, media_creators.rebate_percent),
      contact=COALESCE(excluded.contact, media_creators.contact),
      tags_json=excluded.tags_json,
      audience_tags_json=excluded.audience_tags_json,
      titles_collected=excluded.titles_collected,
      title_status=excluded.title_status,
      title_error=excluded.title_error,
      metric_status=excluded.metric_status,
      metric_error=excluded.metric_error,
      metrics_json=excluded.metrics_json,
      quote_updated_at=excluded.quote_updated_at,
      data_updated_at=excluded.data_updated_at,
      source_project=excluded.source_project,
      entry_status=CASE WHEN excluded.rebate_percent IS NOT NULL AND excluded.contact IS NOT NULL THEN '正式入库' ELSE excluded.entry_status END,
      selected_by_client=excluded.selected_by_client,
      updated_at=excluded.updated_at
  `).run(
    creator.id,
    creator.nickname,
    creator.xhsId,
    creator.platform,
    creator.pgyHomeUrl,
    creator.followers,
    creator.imageQuote ?? null,
    creator.videoQuote ?? null,
    creator.rebatePercent ?? null,
    creator.contact ?? null,
    json(creator.tags),
    json(creator.audienceTags),
    creator.titlesCollected,
    creator.titleStatus,
    creator.titleError ?? null,
    creator.metricStatus,
    creator.metricError ?? null,
    json(creator.metrics),
    creator.quoteUpdatedAt ?? null,
    creator.dataUpdatedAt ?? null,
    creator.sourceProject ?? null,
    creator.entryStatus,
    creator.selectedByClient ? 1 : 0,
    creator.updatedAt,
  )

  const stored = db.prepare('SELECT id FROM media_creators WHERE xhs_id = ? AND platform = ?').get(creator.xhsId, creator.platform)
  const storedCreatorId = stored?.id || creator.id
  db.prepare('DELETE FROM media_creator_titles WHERE creator_id = ?').run(storedCreatorId)
  for (const title of creator.titles.slice(0, 50)) {
    db.prepare('INSERT INTO media_creator_titles (id, creator_id, title, published_at, created_at) VALUES (?, ?, ?, ?, ?)').run(
      randomUUID(),
      storedCreatorId,
      String(title.title || title),
      title.publishedAt || null,
      now(),
    )
  }
}

function ingest(body) {
  const inputProjectId = body.project_id || body.projectId
  const task = body.taskId
    ? getTask(body.taskId)
    : inputProjectId
      ? db.prepare("SELECT * FROM media_collection_tasks WHERE project_id = ? ORDER BY updated_at DESC LIMIT 1").get(inputProjectId)
      : null
  const taskApi = task && task.projectId ? task : task ? rowToTask(task) : null
  const projectId = taskApi?.projectId || inputProjectId
  if (!projectId) throw new Error('任务或项目不存在')
  const projectRow = db.prepare('SELECT * FROM media_projects WHERE id = ?').get(projectId)
  if (!projectRow) throw new Error('项目不存在')
  const project = rowToProject(projectRow)
  const creators = Array.isArray(body.creators) ? body.creators : Array.isArray(body.rows) ? body.rows : []

  for (const item of creators) {
    upsertCreator(normalizeCreator(item, project.name))
  }

  rebuildRecommendations(project)
  const nextStatus = body.status || 'done'
  const updatedTask = taskApi
    ? updateTaskStatus(taskApi.id, {
        status: nextStatus,
        collectedCount: creators.length,
        candidateCount: creators.length,
        message: body.message || `采集完成，入库候选 ${creators.length} 个`,
      })
    : null
  db.prepare('UPDATE media_projects SET status = ?, updated_at = ? WHERE id = ?').run(nextStatus === 'done' ? 'ready' : 'needs_review', now(), project.id)
  return {
    ...(updatedTask || {}),
    ingested: creators.length,
    repairCount: creators.filter(item => !(item.xhsId || item.xhs_id || item.platformId || item.platform_id) || !(item.pgyHomeUrl || item.pgy_home_url || item.homeUrl || item.home_url)).length,
    recommendations: getProjectResult(project.id).recommendations,
  }
}

function legacyTask(id) {
  const task = getTask(id)
  if (!task) return null
  const projectRow = db.prepare('SELECT * FROM media_projects WHERE id = ?').get(task.projectId)
  const project = projectRow ? rowToProject(projectRow) : null
  return {
    task: {
      id: task.id,
      projectId: task.projectId,
      targetCount: task.targetCount,
      type: 'pgy_find',
      payload: {
        brief: project?.brief || '',
        brand: project?.brand || '',
        analysis: project?.analysis || null,
        collector: {
          keywords: project?.analysis?.searchKeywords || [],
          productSearchKeywords: project?.analysis?.productKeywords || [],
          pgyFilterPlan: project?.analysis?.pgyFilterPlan || null,
        },
      },
    },
  }
}

function rebuildRecommendations(project) {
  db.prepare('DELETE FROM media_recommendations WHERE project_id = ?').run(project.id)
  const creators = listCreators(new URLSearchParams()).filter(creator => creator.sourceProject === project.name || creator.entryStatus === '正式入库' || creator.entryStatus === '候选库')
  const analysis = project.analysis || buildRuleAnalysis(project.brief)
  const scored = creators.map(creator => scoreCreator(creator, analysis)).sort((a, b) => b.score - a.score)
  for (const item of scored.slice(0, Math.max(analysis.targetCount || project.targetCount, 30))) {
    db.prepare(`
      INSERT INTO media_recommendations (id, project_id, creator_id, tier, score, requirement_hits_json, title_match_summary, risk_notes_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(project_id, creator_id) DO UPDATE SET
        tier=excluded.tier,
        score=excluded.score,
        requirement_hits_json=excluded.requirement_hits_json,
        title_match_summary=excluded.title_match_summary,
        risk_notes_json=excluded.risk_notes_json
    `).run(
      `rec_${project.id}_${item.creator.id}`,
      project.id,
      item.creator.id,
      item.tier,
      item.score,
      json(item.requirementHits),
      item.titleMatchSummary,
      json(item.riskNotes),
      now(),
    )
  }
}

function scoreCreator(creator, analysis) {
  const hits = []
  let score = 40
  const riskNotes = []
  const quote = creator.videoQuote ?? creator.imageQuote ?? 0
  const cpmMax = analysis.dataThresholds?.cpmMax
  const cpeMax = analysis.dataThresholds?.cpeMax
  const cpm = creator.metrics.estimatedCpm
  const cpe = creator.metrics.estimatedInteractionUnitPrice

  const platformHit = analysis.platforms.includes(creator.platform)
  hits.push({ label: '平台符合', passed: platformHit, actual: creator.platform })
  if (platformHit) score += 10

  const budgetHit = (!analysis.budgetMin || quote >= analysis.budgetMin) && (!analysis.budgetMax || quote <= analysis.budgetMax)
  hits.push({ label: '单个预算匹配', passed: budgetHit, actual: quote ? String(quote) : '未登记' })
  if (budgetHit) score += 12
  else riskNotes.push('报价不在预算范围内')

  if (cpmMax !== undefined) {
    const passed = cpm !== undefined && cpm < cpmMax
    hits.push({ label: `CPM < ${cpmMax}`, passed, actual: cpm === undefined ? '未采集' : String(cpm) })
    if (passed) score += 12
    else riskNotes.push('CPM 缺失或超标')
  }

  if (cpeMax !== undefined) {
    const passed = cpe !== undefined && cpe < cpeMax
    hits.push({ label: `CPE < ${cpeMax}`, passed, actual: cpe === undefined ? '未采集' : String(cpe) })
    if (passed) score += 12
    else riskNotes.push('CPE 缺失或超标')
  }

  const tagText = [...creator.tags, ...creator.audienceTags].join(' ')
  const tagHits = analysis.audienceTags.filter(tag => tagText.includes(tag))
  if (tagHits.length > 0) score += Math.min(12, tagHits.length * 4)
  hits.push({ label: '标签命中', passed: tagHits.length > 0, actual: tagHits.join('、') || '未命中' })

  const titlePassed = creator.titleStatus === 'collected' && creator.titlesCollected >= 30
  hits.push({ label: '标题完整', passed: titlePassed, actual: `${creator.titlesCollected}/30` })
  if (titlePassed) score += 10
  else riskNotes.push('标题不足，需要补采或人工复核')

  const strict = hits.every(hit => hit.passed)
  const tier = strict ? 'strict' : platformHit && budgetHit ? 'backup' : 'rejected'
  return {
    creator,
    tier,
    score: Math.max(0, Math.min(score, 100)),
    requirementHits: hits,
    titleMatchSummary: titlePassed ? '标题数量达标，可进入 AI 标题/标签复核。' : '标题不足，暂不进入严格推荐。',
    riskNotes,
  }
}

function getProjectResult(projectId) {
  const projectRow = db.prepare('SELECT * FROM media_projects WHERE id = ?').get(projectId)
  if (!projectRow) throw new Error('项目不存在')
  const project = rowToProject(projectRow)
  rebuildRecommendations(project)
  const rows = db.prepare(`
    SELECT r.*, c.*
    FROM media_recommendations r
    JOIN media_creators c ON c.id = r.creator_id
    WHERE r.project_id = ?
    ORDER BY r.tier ASC, r.score DESC
  `).all(projectId)

  const recommendations = rows.map(row => ({
    id: row.id,
    creator: rowToCreator(row),
    tier: row.tier,
    score: row.score,
    requirementHits: parseJson(row.requirement_hits_json, []),
    titleMatchSummary: row.title_match_summary,
    riskNotes: parseJson(row.risk_notes_json, []),
  }))

  return {
    projectId,
    strictCount: recommendations.filter(item => item.tier === 'strict').length,
    backupCount: recommendations.filter(item => item.tier === 'backup').length,
    rejectedCount: recommendations.filter(item => item.tier === 'rejected').length,
    summary: recommendations.length === 0 ? '等待采集器回传候选账号。' : '已按规则筛选并分层，严格不足时用可备选补充。',
    recommendations,
  }
}

function platforms() {
  return ['小红书', '小红书蒲公英', '巨量星图', '视频号互选']
}

function tags() {
  const rows = db.prepare('SELECT tags_json, audience_tags_json FROM media_creators').all()
  const values = rows.flatMap(row => [...parseJson(row.tags_json, []), ...parseJson(row.audience_tags_json, [])])
  return unique(['美食', '美食测评', '上班族', '学生党', '精致妈妈', '科技数码', '职场', '情侣', ...values])
}

function seedIfNeeded() {
  if (process.env.MEDIA_SEED_DEMO !== 'true') return
  const count = db.prepare('SELECT COUNT(*) AS count FROM media_creators').get().count
  if (count > 0) return
  const seedProject = createProject({
    id: 'project-wolong-seed',
    name: '沃隆 选号项目',
    brand: '沃隆',
    targetCount: 25,
    brief: '美食种草、美食开箱测评，覆盖上班族、学生党、养生党、精致妈妈，CPM<70，CPE<8。',
    analysis: buildRuleAnalysis('【品牌】沃隆 美食种草 美食开箱测评 CPM<70 CPE<8'),
  })
  const seededCreators = [
    {
      nickname: '吃货赵圆圆',
      xhsId: '107722235',
      pgyHomeUrl: 'https://pgy.xiaohongshu.com/solar/pre-trade/kol/107722235',
      followers: 166000,
      imageQuote: 9000,
      videoQuote: 9000,
      tags: ['美食', '美食测评', '测评', '低脂低卡', '开箱'],
      audienceTags: ['上班族', '女性'],
      titlesCollected: 50,
      metrics: { exposureMedian: 453771, readMedian: 81610, interactionMedian: 1344, estimatedCpm: 6.6, estimatedReadUnitPrice: 0.11, estimatedInteractionUnitPrice: 2.23, collectedAt: today() },
      sourceProject: seedProject.name,
      entryStatus: '候选库',
    },
  ]
  for (const creator of seededCreators) upsertCreator(normalizeCreator(creator, seedProject.name))
  rebuildRecommendations(seedProject)
}

async function route(request, response) {
  if (request.method === 'OPTIONS') {
    send(response, 204, null)
    return
  }

  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
  const path = url.pathname.replace(/\/+$/, '') || '/'

  try {
    if (request.method === 'GET' && (path === '/health' || path === '/api/health' || path === '/api/media/health')) {
      send(response, 200, ok({ status: 'ok', dbPath: DB_PATH, workerTokenRequired: Boolean(WORKER_TOKEN) }))
      return
    }

    if (request.method === 'GET' && path === '/api/media/platforms') {
      send(response, 200, ok(platforms()))
      return
    }

    if (request.method === 'GET' && path === '/api/media/tags') {
      send(response, 200, ok(tags()))
      return
    }

    if (request.method === 'GET' && path === '/api/media/creators') {
      send(response, 200, ok(listCreators(url.searchParams)))
      return
    }

    if (request.method === 'GET' && path === '/api/media/kols') {
      try {
        send(response, 200, ok(listKols(url.searchParams)))
      } catch (error) {
        console.error('[media-api] kol_search_failed', {
          exceptionType: error instanceof Error ? error.constructor.name : 'UnknownError',
        })
        send(response, 500, fail('达人搜索暂时不可用', 500))
      }
      return
    }

    if (request.method === 'GET' && path === '/api/media/projects') {
      send(response, 200, ok(listProjects()))
      return
    }

    if (request.method === 'POST' && path === '/api/media/projects') {
      send(response, 200, ok(createProject(await readBody(request))))
      return
    }

    if (request.method === 'POST' && path === '/api/media/brief-intelligence') {
      send(response, 200, ok(await briefIntelligence(await readBody(request))))
      return
    }

    if (request.method === 'POST' && path === '/api/media/collection-tasks') {
      send(response, 200, ok(createTask(await readBody(request))))
      return
    }

    const taskMatch = path.match(/^\/api\/media\/collection-tasks\/([^/]+)$/)
    if (request.method === 'GET' && taskMatch) {
      const task = getTask(taskMatch[1])
      send(response, task ? 200 : 404, task ? ok(task) : fail('任务不存在', 404))
      return
    }

    const legacyTaskMatch = path.match(/^\/api\/codex-tasks\/([^/]+)$/)
    if (request.method === 'GET' && legacyTaskMatch) {
      const task = legacyTask(legacyTaskMatch[1])
      send(response, task ? 200 : 404, task || { error: '任务不存在' })
      return
    }

    const legacyStatusMatch = path.match(/^\/api\/codex-tasks\/([^/]+)\/status$/)
    if (request.method === 'POST' && legacyStatusMatch) {
      const body = await readBody(request)
      const task = updateTaskStatus(legacyStatusMatch[1], {
        status: body.status,
        collectedCount: body.collected_count,
        candidateCount: body.result?.collected ?? body.collected_count,
        message: body.message,
      })
      send(response, 200, { ok: true, task })
      return
    }

    if (request.method === 'GET' && path === '/api/media/collector/tasks/next') {
      if (!requireWorker(request, response)) return
      send(response, 200, ok(nextTask()))
      return
    }

    const statusMatch = path.match(/^\/api\/media\/collector\/tasks\/([^/]+)\/status$/)
    if (request.method === 'POST' && statusMatch) {
      if (!requireWorker(request, response)) return
      send(response, 200, ok(updateTaskStatus(statusMatch[1], await readBody(request))))
      return
    }

    if (request.method === 'POST' && path === '/api/media/collector/ingest') {
      if (!requireWorker(request, response)) return
      send(response, 200, ok(ingest(await readBody(request))))
      return
    }

    if (request.method === 'POST' && path === '/api/collector/ingest') {
      send(response, 200, ingest(await readBody(request)))
      return
    }

    const resultMatch = path.match(/^\/api\/media\/projects\/([^/]+)\/result$/)
    if (request.method === 'GET' && resultMatch) {
      send(response, 200, ok(getProjectResult(resultMatch[1])))
      return
    }

    send(response, 404, fail('media-api endpoint 不存在', 404))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'media-api 内部错误'
    send(response, 500, fail(message, 500))
  }
}

seedIfNeeded()
createServer(route).listen(PORT, () => {
  console.log(`[media-api] listening on http://localhost:${PORT}`)
  console.log(`[media-api] database ${DB_PATH}`)
})
