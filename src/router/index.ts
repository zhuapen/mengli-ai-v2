import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { isFeatureEnabled } from '@/core/config/feature'
import { useAuthStore } from '@/core/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/modules/home/page.vue'),
      },
      {
        path: 'copy',
        name: 'Copy',
        component: () => import('@/modules/copy/page.vue'),
      },
      {
        path: 'image',
        name: 'Image',
        component: () => import('@/modules/image/page.vue'),
      },
      {
        path: 'media',
        name: 'Media',
        component: () => import('@/modules/media/page.vue'),
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/modules/article/page.vue'),
      },
      {
        path: 'assets',
        name: 'Assets',
        component: () => import('@/modules/assets/page.vue'),
      },
      {
        path: 'plugin',
        name: 'Plugin',
        component: () => import('@/modules/plugin/page.vue'),
        meta: { feature: 'enablePlugin' },
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/modules/history/page.vue'),
      },
      {
        path: 'datacenter',
        name: 'DataCenter',
        component: () => import('@/modules/datacenter/page.vue'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/modules/auth/LoginPage.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/modules/auth/RegisterPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/modules/error/page.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // Feature Flag 检查
  const feature = to.meta.feature as string | undefined
  if (feature && !isFeatureEnabled(feature as any)) {
    next({ name: 'NotFound' })
    return
  }

  // 认证检查
  const publicPages = ['Home', 'Login', 'Register', 'NotFound']
  const isPublic = publicPages.includes(to.name as string) || to.path === '/'

  if (!isPublic && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  next()
})

export default router
