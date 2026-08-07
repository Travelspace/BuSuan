import dayjs from 'dayjs'
import type { WuXing } from '../types'

export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export const getAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export const getChineseZodiac = (year: number): string => {
  const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
  return zodiacs[(year - 4) % 12]
}

export const getWuXingColor = (wuxing: WuXing): string => {
  const colorMap: Record<WuXing, string> = {
    '金': '#c0c0c0',
    '木': '#27ae60',
    '水': '#3498db',
    '火': '#e74c3c',
    '土': '#d4a574',
  }
  return colorMap[wuxing]
}

export { getWuXingByGan, getWuXingByZhi, wuXingRelation } from './wuxing'

export const getTimeIndex = (hour: number, minute: number): number => {
  if (hour === 0 && minute === 0) return 0
  if (hour === 23 && minute >= 30) return 12
  return Math.floor((hour + 1) / 2)
}

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
