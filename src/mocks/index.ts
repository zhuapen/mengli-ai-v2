/**
 * Mock API 统一导出
 * 所有 mock 均返回 Promise<ApiResponse<T>> 格式
 * 通过 enableMock feature flag 控制是否使用
 */

export { copyMockApi } from './copy'
export { imageMockApi } from './image'
export { homeMockApi } from './home'
export { historyMockApi } from './history'
export { mediaMockApi } from './media'
export { articleMockApi } from './article'
export { assetsMockApi } from './assets'
export { datacenterMockApi } from './datacenter'
export { pluginMockApi } from './plugin'
export { userMockApi } from './user'
