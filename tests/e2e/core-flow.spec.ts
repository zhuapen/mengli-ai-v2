import { test, expect } from '@playwright/test'

test.describe('核心业务流程', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[data-testid="login-email"]', 'admin@mengli.ai')
    await page.fill('[data-testid="login-password"]', '123456')
    await page.click('[data-testid="login-submit"]')
    await page.waitForURL('/')
  })

  test('copy 页面输入主题后可生成文案', async ({ page }) => {
    await page.click('a:has-text("小红书文案撰写")')
    await page.waitForSelector('.page-title')

    // 输入产品名称
    await page.fill('input[placeholder*="超上扬精华"]', '测试精华液')

    // 点击生成
    await page.click('[data-testid="copy-generate"]')

    // 等待生成完成
    await page.waitForFunction(() => {
      const output = document.querySelector('.copy-output pre')
      return output && output.textContent && output.textContent.length > 0
    }, { timeout: 10000 })

    const output = await page.locator('.copy-output pre').textContent()
    expect(output).toContain('测试精华液')
  })

  test('image 页面输入 prompt 后可生成图片', async ({ page }) => {
    await page.click('a:has-text("图片生成")')
    await page.waitForSelector('.page-title')

    // 输入描述
    await page.fill('textarea[placeholder*="可爱的卡通小象"]', '一只可爱的橘猫')

    // 点击生成
    await page.click('[data-testid="image-generate"]')

    // 等待生成完成
    await page.waitForFunction(() => {
      const img = document.querySelector('.gen-result')
      return img && img.getAttribute('src')
    }, { timeout: 10000 })

    const imgSrc = await page.locator('.gen-result').getAttribute('src')
    expect(imgSrc).toBeTruthy()
  })

  test('history 页面可显示空状态', async ({ page }) => {
    await page.click('a:has-text("历史记录")')
    await page.waitForSelector('.page-title')

    // 等待 loading 结束后再检查
    await page.waitForFunction(() => {
      const loading = document.querySelector('.ds-loading')
      return !loading || loading.offsetParent === null
    }, { timeout: 10000 })

    const hasEmpty = await page.locator('.ds-empty').count()
    const hasItems = await page.locator('.history-item').count()
    expect(hasEmpty + hasItems).toBeGreaterThan(0)
  })
})
