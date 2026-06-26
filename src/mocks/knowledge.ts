/**
 * 品牌知识库 Mock 数据
 */

export interface Brand {
  id: string
  name: string
  slogan: string
  personality: string
  style: string
  standard: string
}

export const mockBrands: Brand[] = [
  {
    id: '1',
    name: '萌力互动',
    slogan: '创意 · 高效 · 品质',
    personality: '年轻、活力、创新、专业、值得信赖',
    style: '简洁有力、有记忆点、拒绝废话、拒绝AI腔',
    standard: 'Awwwards 级别文案，苹果式简洁 + 耐克式力量感',
  },
  {
    id: '2',
    name: '听研 BIOLAB',
    slogan: '科技护肤，精准高效',
    personality: '专业、科技感、高端、值得信赖',
    style: '专业术语+生活化表达，数据说话，成分党友好',
    standard: '参考修丽可、SK-II 的品牌调性',
  },
]

export interface WritingTemplate {
  id: string
  name: string
  steps: string[]
}

export const mockWritingTemplates: WritingTemplate[] = [
  {
    id: '1',
    name: '小红书种草模板',
    steps: [
      '标题：用数字+痛点+解决方案，如「3步搞定XX」',
      '开头：用真实场景引入，制造共鸣',
      '正文：分点说明，每点配emoji',
      '结尾：总结+互动引导',
      '标签：5-8个相关标签',
    ],
  },
  {
    id: '2',
    name: '朋友圈文案模板',
    steps: [
      '第一行：吸引眼球的开头',
      '中间：2-3个核心卖点',
      '结尾：行动号召',
      '配图建议：产品图+使用场景图',
    ],
  },
]
