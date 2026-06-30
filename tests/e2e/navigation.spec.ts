import { test, expect } from '@playwright/test'

test.describe('导航', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto('/login')
    await page.fill('[data-testid="login-email"]', 'admin@mengli.ai')
    await page.fill('[data-testid="login-password"]', '123456')
    await page.click('[data-testid="login-submit"]')
    await page.waitForURL('/')
  })

  test('首页可访问', async ({ page }) => {
    await expect(page.locator('.home-title')).toContainText('萌力互动')
  })

  test('文案页面可访问', async ({ page }) => {
    await page.click('a:has-text("小红书文案撰写")')
    await expect(page.locator('.page-title')).toContainText('小红书文案撰写')
  })

  test('图片页面可访问', async ({ page }) => {
    await page.click('a:has-text("图片生成")')
    await expect(page.locator('.page-title')).toContainText('图片生成')
  })

  test('媒体库可访问', async ({ page }) => {
    await page.click('a:has-text("媒体库")')
    await expect(page.locator('.page-title')).toContainText('智能媒体库')
  })

  test('历史记录可访问', async ({ page }) => {
    await page.click('a:has-text("历史记录")')
    await expect(page.locator('.page-title')).toContainText('生成历史')
  })

  test('数据中心可访问', async ({ page }) => {
    await page.click('a:has-text("数据中心")')
    await expect(page.locator('.page-title')).toContainText('数据中心')
  })

  test('404 页面可访问', async ({ page }) => {
    await page.goto('/nonexistent-page')
    await expect(page.locator('.error-code')).toContainText('404')
    await expect(page.locator('.error-title')).toContainText('页面未找到')
  })
})
