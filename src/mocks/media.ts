/**
 * 媒体库 Mock 数据
 */

export interface KOL {
  id: string
  name: string
  platform: string
  avatar: string
  followers: number
  engagement: number
  tags: string[]
  price: number
}

export const mockKOLList: KOL[] = [
  {
    id: '1',
    name: '小美爱穿搭',
    platform: '小红书',
    avatar: '👗',
    followers: 125000,
    engagement: 5.2,
    tags: ['穿搭', '时尚', '种草'],
    price: 5000,
  },
  {
    id: '2',
    name: '美食达人阿强',
    platform: '抖音',
    avatar: '🍜',
    followers: 890000,
    engagement: 3.8,
    tags: ['美食', '探店', '教程'],
    price: 15000,
  },
  {
    id: '3',
    name: '科技小王子',
    platform: 'B站',
    avatar: '📱',
    followers: 450000,
    engagement: 6.1,
    tags: ['科技', '数码', '评测'],
    price: 8000,
  },
  {
    id: '4',
    name: '健身女神Lily',
    platform: '小红书',
    avatar: '💪',
    followers: 230000,
    engagement: 4.5,
    tags: ['健身', '运动', '生活方式'],
    price: 6000,
  },
]

export const mockPlatforms = ['全部', '小红书', '抖音', 'B站', '微博', '快手']

export const mockTags = ['穿搭', '时尚', '美食', '科技', '美妆', '健身', '旅行', '母婴']
