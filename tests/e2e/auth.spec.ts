import { test, expect } from '@playwright/test'

test.describe('Auth 流程', () => {
  test('访问 /login 页面正常', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h3')).toContainText('登录')
  })

  test('mock 模式下登录成功后跳转 home', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="login-email"]', 'admin@mengli.ai')
    await page.fill('[data-testid="login-password"]', '123456')
    await page.click('[data-testid="login-submit"]')
    await page.waitForURL('/')
    await expect(page.locator('.nav-logo-text')).toContainText('萌力互动')
  })

  test('登录后 navbar 显示用户信息', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="login-email"]', 'admin@mengli.ai')
    await page.fill('[data-testid="login-password"]', '123456')
    await page.click('[data-testid="login-submit"]')
    await page.waitForURL('/')
    await expect(page.locator('[data-testid="navbar-username"]')).toContainText('管理员')
  })
})
