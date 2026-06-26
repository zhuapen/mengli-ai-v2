/**
 * 功能开关配置
 * 用于控制功能的启用/禁用，无需删除代码
 */
export const features = {
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

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(feature: FeatureKey): boolean {
  return features[feature] ?? false
}

export default features
