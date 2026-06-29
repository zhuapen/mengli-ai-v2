/**
 * 功能开关配置
 * enableMock 从环境变量读取，开发默认 true，生产默认 false
 */

/** 从环境变量读取 mock 开关，默认 true（本地开发） */
const envMock = import.meta.env.VITE_ENABLE_MOCK
const enableMockDefault = envMock !== undefined ? envMock === 'true' : true

export const features = {
  // 核心开关：从环境变量读取
  enableMock: enableMockDefault,

  // 已完成功能
  enableAuth: true,
  enableHome: true,
  enableCopy: true,
  enableImage: true,
  enableMedia: true,
  enableHistory: true,

  // 开发中功能
  enablePlugin: true,
  enableAssets: true,
  enableDataCenter: true,
  enableArticle: true,

  // 未开发功能
  enableVideo: false,
  enableWorkflow: false,
  enableAgent: false,
  enableRAG: false,
}

export type FeatureKey = keyof typeof features

/** 检查功能是否启用 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
  return features[feature] ?? false
}

export default features
