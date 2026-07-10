import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { env, execPath } from 'node:process'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'

const mediaApiDir = fileURLToPath(new URL('.', import.meta.url))
const serverPath = resolve(mediaApiDir, 'server.mjs')

async function reservePort() {
  return await new Promise((resolvePort, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Unable to reserve a test port'))
        return
      }
      server.close(error => error ? reject(error) : resolvePort(address.port))
    })
  })
}

async function startMediaApi(seedDemo) {
  const directory = mkdtempSync(join(tmpdir(), 'mengli-media-api-test-'))
  const port = await reservePort()
  const child = spawn(execPath, [serverPath], {
    cwd: mediaApiDir,
    env: {
      HOME: env.HOME || tmpdir(),
      LANG: env.LANG || 'C.UTF-8',
      PATH: env.PATH || '',
      MEDIA_API_PORT: String(port),
      MEDIA_DB_PATH: join(directory, 'media.sqlite'),
      MEDIA_SEED_DEMO: seedDemo ? 'true' : 'false',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let diagnostics = ''
  const appendDiagnostics = chunk => {
    diagnostics = `${diagnostics}${chunk}`.slice(-2_000)
  }
  child.stdout.on('data', appendDiagnostics)
  child.stderr.on('data', appendDiagnostics)

  const baseUrl = `http://127.0.0.1:${port}`
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      rmSync(directory, { recursive: true, force: true })
      throw new Error(`media-api exited before startup: ${diagnostics}`)
    }
    try {
      const response = await fetch(`${baseUrl}/api/media/health`)
      if (response.ok) return { baseUrl, child, directory }
    } catch {
      // The server may still be opening its isolated SQLite database.
    }
    await new Promise(resolveDelay => setTimeout(resolveDelay, 50))
  }

  child.kill('SIGTERM')
  rmSync(directory, { recursive: true, force: true })
  throw new Error(`media-api did not become ready: ${diagnostics}`)
}

async function stopMediaApi(instance) {
  if (!instance) return
  if (instance.child.exitCode === null) {
    instance.child.kill('SIGTERM')
    await Promise.race([
      new Promise(resolveExit => instance.child.once('exit', resolveExit)),
      new Promise(resolveDelay => setTimeout(resolveDelay, 1_000)),
    ])
  }
  rmSync(instance.directory, { recursive: true, force: true })
}

async function getJson(baseUrl, path) {
  const response = await fetch(`${baseUrl}${path}`)
  const body = await response.json()
  return { response, body }
}

let seededApi

before(async () => {
  seededApi = await startMediaApi(true)
})

after(async () => {
  await stopMediaApi(seededApi)
})

test('GET /api/media/kols returns the normal empty contract without data', async () => {
  const emptyApi = await startMediaApi(false)
  try {
    const { response, body } = await getJson(emptyApi.baseUrl, '/api/media/kols')
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type') || '', /^application\/json/)
    assert.deepEqual(body, { code: 0, message: 'success', success: true, data: [] })
  } finally {
    await stopMediaApi(emptyApi)
  }
})

test('GET /api/media/kols returns the frontend KOL fields', async () => {
  const { response, body } = await getJson(seededApi.baseUrl, '/api/media/kols')
  assert.equal(response.status, 200)
  assert.equal(body.success, true)
  assert.equal(body.data.length, 1)
  assert.deepEqual(Object.keys(body.data[0]).sort(), [
    'avatar',
    'engagement',
    'followers',
    'id',
    'name',
    'platform',
    'price',
    'tags',
  ])
  assert.equal(typeof body.data[0].name, 'string')
  assert.equal(typeof body.data[0].followers, 'number')
  assert.ok(Array.isArray(body.data[0].tags))
})

test('keyword search matches creator text and returns an empty result when unmatched', async () => {
  const matched = await getJson(seededApi.baseUrl, '/api/media/kols?keyword=%E7%BE%8E%E9%A3%9F')
  const unmatched = await getJson(seededApi.baseUrl, '/api/media/kols?keyword=not-present')
  assert.equal(matched.body.data.length, 1)
  assert.deepEqual(unmatched.body.data, [])
})

test('platform filtering follows the existing creator contract', async () => {
  const matched = await getJson(seededApi.baseUrl, '/api/media/kols?platform=%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%92%B2%E5%85%AC%E8%8B%B1')
  const unmatched = await getJson(seededApi.baseUrl, '/api/media/kols?platform=%E5%B7%A8%E9%87%8F%E6%98%9F%E5%9B%BE')
  assert.equal(matched.body.data.length, 1)
  assert.deepEqual(unmatched.body.data, [])
})

test('tag filtering accepts Axios array syntax and comma-separated values', async () => {
  const arraySyntax = await getJson(seededApi.baseUrl, '/api/media/kols?tags%5B%5D=%E7%BE%8E%E9%A3%9F')
  const commaSeparated = await getJson(seededApi.baseUrl, '/api/media/kols?tags=missing,%E4%B8%8A%E7%8F%AD%E6%97%8F')
  const unmatched = await getJson(seededApi.baseUrl, '/api/media/kols?tags=missing')
  assert.equal(arraySyntax.body.data.length, 1)
  assert.equal(commaSeparated.body.data.length, 1)
  assert.deepEqual(unmatched.body.data, [])
})

test('follower, quote, rebate, and entry-status filters are applied safely', async () => {
  const matched = await getJson(seededApi.baseUrl, '/api/media/kols?minFollowers=100000&maxQuote=9000&maxRebate=0&entryStatus=%E5%80%99%E9%80%89%E5%BA%93')
  const unmatched = await getJson(seededApi.baseUrl, '/api/media/kols?minFollowers=200000&minQuote=10000&minRebate=1')
  assert.equal(matched.body.data.length, 1)
  assert.deepEqual(unmatched.body.data, [])
})

test('invalid numeric and unsupported pagination parameters do not produce 500', async () => {
  const { response, body } = await getJson(seededApi.baseUrl, '/api/media/kols?minFollowers=invalid&page=1&page_size=20')
  assert.equal(response.status, 200)
  assert.equal(body.data.length, 1)
})

test('existing creators, projects, platforms, and tags routes keep working', async () => {
  for (const path of ['/api/media/creators', '/api/media/projects', '/api/media/platforms', '/api/media/tags']) {
    const { response, body } = await getJson(seededApi.baseUrl, path)
    assert.equal(response.status, 200, path)
    assert.equal(body.success, true, path)
    assert.ok(Array.isArray(body.data), path)
  }
})
