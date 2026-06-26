/**
 * 首页 Mock 数据
 */

export interface CaseStudy {
  id: string
  title: string
  image: string
  description: string
}

export const mockCaseStudies: CaseStudy[] = [
  {
    id: '1',
    title: '案例展示 1',
    image: '',
    description: '某知名品牌社交媒体营销',
  },
  {
    id: '2',
    title: '案例展示 2',
    image: '',
    description: '新品上市全渠道推广',
  },
  {
    id: '3',
    title: '案例展示 3',
    image: '',
    description: 'KOL 矩阵带货案例',
  },
]

export const mockAboutItems = [
  { id: '1', title: '公司介绍', description: '萌力互动成立于2020年' },
  { id: '2', title: '团队风采', description: '专业团队100+人' },
  { id: '3', title: '合作伙伴', description: '服务500+品牌客户' },
]
