import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { isFeatureEnabled } from '@/core/config/feature'
import type { FeatureKey } from '@/core/config/feature'
import { useUserStore } from '@/core/stores/user'
import { getAccessToken } from '@/core/auth/token'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/modules/home/page.vue') },
      { path: 'copy', name: 'Copy', component: () => import('@/modules/copy/page.vue') },
      { path: 'image', name: 'Image', component: () => import('@/modules/image/page.vue') },
      { path: 'media', name: 'Media', component: () => import('@/modules/media/page.vue') },
      { path: 'article', name: 'Article', component: () => import('@/modules/article/page.vue') },
      { path: 'assets', name: 'Assets', component: () => import('@/modules/assets/page.vue') },
      {
        path: 'plugin',
        name: 'Plugin',
        component: () => import('@/modules/plugin/page.vue'),
        meta: { feature: 'enablePlugin' },
      },
      { path: 'history', name: 'History', component: () => import('@/modules/history/page.vue') },
      { path: 'datacenter', name: 'DataCenter', component: () => import('@/modules/datacenter/page.vue') },
      { path: 'login', name: 'Login', component: () => import('@/modules/auth/LoginPage.vue') },
      { path: 'register', name: 'Register', component: () => import('@/modules/auth/RegisterPage.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/modules/error/page.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/** 需要登录才能访问的页面（白名单之外的） */
const publicPageNames = new Set(['Home', 'Login', 'Register', 'NotFound'])

/** 已登录后不应访问的页面 */
const guestOnlyPageNames = new Set(['Login', 'Register'])

router.beforeEach(async (to, _from, next) => {
  // Feature Flag 检查
  const feature = to.meta.feature as string | undefined
  if (feature && !isFeatureEnabled(feature as FeatureKey)) {
    next({ name: 'NotFound' })
    return
  }

  const userStore = useUserStore()
  const hasToken = !!getAccessToken()
  const isPublic = publicPageNames.has(to.name as string) || to.path === '/'

  // 有 token 但没有用户信息 → 尝试恢复登录态
  if (hasToken && !userStore.user) {
    await userStore.restoreSession()
  }

  const isLoggedIn = userStore.isLoggedIn

  // 已登录访问 login/register → 跳转首页
  if (isLoggedIn && guestOnlyPageNames.has(to.name as string)) {
    next({ name: 'Home' })
    return
  }

  // 未登录访问非公开页面 → 跳转登录
  if (!isPublic && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
