/**
 * 通用状态
 */
export type Status = 'idle' | 'loading' | 'success' | 'error'

/**
 * 通用选项
 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

/**
 * 通用键值对
 */
export type Record<K extends string | number | symbol, V> = {
  [key in K]: V
}

/**
 * 通用列表项
 */
export interface ListItem {
  id: string
  name: string
  description?: string
}

/**
 * 通用时间范围
 */
export interface DateRange {
  start: string
  end: string
}

/**
 * 通用文件信息
 */
export interface FileInfo {
  name: string
  size: number
  type: string
  url: string
}
