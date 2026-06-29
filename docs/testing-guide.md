# 测试指南

## 技术栈

| 工具 | 用途 |
|------|------|
| Vitest | 单元测试 / Store / Service 测试 |
| @vue/test-utils | Vue 组件测试 |
| jsdom | 组件测试运行环境 |
| Playwright | E2E 测试 |

## 目录结构

```
tests/
├── setup.ts                    # 测试环境 setup（localStorage polyfill）
├── utils/
│   ├── test-pinia.ts           # 测试用 Pinia 工具
│   └── mock-api.ts             # Mock 数据工具
├── unit/
│   ├── core/                   # 核心层测试
│   │   ├── api-error-code.test.ts
│   │   └── token.test.ts
│   ├── services/               # Service 测试
│   │   ├── copy.service.test.ts
│   │   └── auth.service.test.ts
│   ├── stores/                 # Store 测试
│   │   ├── copy.store.test.ts
│   │   └── image.store.test.ts
│   └── components/             # 组件测试
│       ├── DsLoading.test.ts
│       ├── DsError.test.ts
│       └── DsEmpty.test.ts
└── e2e/                        # E2E 测试
    ├── auth.spec.ts
    ├── navigation.spec.ts
    └── core-flow.spec.ts
```

## 本地运行命令

```bash
# 运行所有单元测试
npm run test:unit

# 运行单元测试（watch 模式）
npm run test:unit:watch

# 运行单元测试 + 覆盖率
npm run test:coverage

# 运行 E2E 测试
npm run test:e2e

# 运行 E2E 测试（UI 模式）
npm run test:e2e:ui

# 完整检查（build + lint + test）
npm run check
```

## 如何写 Store 测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestPinia } from '../../utils/test-pinia'
import { useXxxStore } from '@/modules/xxx/store'

describe('useXxxStore', () => {
  beforeEach(() => {
    createTestPinia()  // 每个测试前创建新的 Pinia 实例
  })

  it('初始状态正确', () => {
    const store = useXxxStore()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('action 成功后状态更新', async () => {
    const store = useXxxStore()
    await store.someAction()
    expect(store.data).toBeDefined()
  })
})
```

## 如何写组件测试

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('渲染正确', () => {
    const wrapper = mount(MyComponent, {
      props: { title: '测试' },
    })
    expect(wrapper.text()).toContain('测试')
  })

  it('事件触发正确', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
```

## 如何写 E2E 测试

```typescript
import { test, expect } from '@playwright/test'

test('功能描述', async ({ page }) => {
  await page.goto('/some-page')
  await page.fill('input', '值')
  await page.click('button:has-text("提交")')
  await expect(page.locator('.result')).toContainText('成功')
})
```

## 当前覆盖范围

### 单元测试（60 个）

| 类型 | 文件 | 测试数 |
|------|------|--------|
| Core | api-error-code.test.ts | 4 |
| Core | token.test.ts | 9 |
| Service | copy.service.test.ts | 6 |
| Service | auth.service.test.ts | 7 |
| Store | copy.store.test.ts | 9 |
| Store | image.store.test.ts | 6 |
| Component | DsLoading.test.ts | 5 |
| Component | DsError.test.ts | 8 |
| Component | DsEmpty.test.ts | 6 |

### E2E 测试（3 个文件）

| 文件 | 覆盖 |
|------|------|
| auth.spec.ts | 登录页面、mock 登录、navbar 用户信息 |
| navigation.spec.ts | 主要页面导航、404 页面 |
| core-flow.spec.ts | 文案生成、图片生成、历史记录 |

## 后续补测计划

- [ ] 更多 Store 测试（media, assets, history, article, datacenter, plugin, home）
- [ ] 更多 Service 测试（image, media, assets, history, article, datacenter, plugin, home）
- [ ] Auth 流程 E2E（logout、401 自动退出）
- [ ] 表单验证测试
- [ ] 错误状态测试
