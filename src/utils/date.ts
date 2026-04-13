import dayjs from 'dayjs'
import type { WuXing, TianGan, DiZhi } from '../types'

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

export const tianGanWuXing = (tianGan: TianGan): WuXing => {
  const map: Record<TianGan, WuXing> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
  }
  return map[tianGan]
}

export const diZhiWuXing = (diZhi: DiZhi): WuXing => {
  const map: Record<DiZhi, WuXing> = {
    '子': '水', '丑': '土',
    '寅': '木', '卯': '木',
    '辰': '土', '巳': '火',
    '午': '火', '未': '土',
    '申': '金', '酉': '金',
    '戌': '土', '亥': '水',
  }
  return map[diZhi]
}

export const wuXingRelation = (wx1: WuXing, wx2: WuXing): '生' | '克' | '比和' => {
  if (wx1 === wx2) return '比和'
  
  const shengMap: Record<WuXing, WuXing> = {
    '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
  }
  
  if (shengMap[wx1] === wx2) return '生'
  if (shengMap[wx2] === wx1) return '克'
  
  const keMap: Record<WuXing, WuXing> = {
    '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
  }
  
  if (keMap[wx1] === wx2) return '克'
  
  return '生'
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
