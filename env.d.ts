/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/** Vite 环境变量类型 */
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** 构建时注入的全局变量 */
declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string
