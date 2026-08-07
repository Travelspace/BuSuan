import type { WuXing, TianGan, DiZhi } from '../../../types'
import { GAN_WUXING, ZHI_WUXING } from '../../../utils/wuxing'

export const WUXING_COLOR: Record<WuXing, string> = {
  '金': '#c0c0c0',
  '木': '#27ae60',
  '水': '#3498db',
  '火': '#e74c3c',
  '土': '#d4a574',
}

export const WUXING_BG: Record<WuXing, string> = {
  '金': 'bg-metal/20 text-metal border-metal/30',
  '木': 'bg-wood/20 text-wood border-wood/30',
  '水': 'bg-water/20 text-water border-water/30',
  '火': 'bg-fire/20 text-fire border-fire/30',
  '土': 'bg-earth/20 text-earth border-earth/30',
}

export const ZHI_SHENGXIAO: Record<string, string> = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔', '辰': '龙', '巳': '蛇',
  '午': '马', '未': '羊', '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪',
}

export const SHICHEN_MAP: { label: string; range: string; index: number }[] = [
  { label: '早子时', range: '00:00-01:00', index: 0 },
  { label: '丑时', range: '01:00-03:00', index: 1 },
  { label: '寅时', range: '03:00-05:00', index: 2 },
  { label: '卯时', range: '05:00-07:00', index: 3 },
  { label: '辰时', range: '07:00-09:00', index: 4 },
  { label: '巳时', range: '09:00-11:00', index: 5 },
  { label: '午时', range: '11:00-13:00', index: 6 },
  { label: '未时', range: '13:00-15:00', index: 7 },
  { label: '申时', range: '15:00-17:00', index: 8 },
  { label: '酉时', range: '17:00-19:00', index: 9 },
  { label: '戌时', range: '19:00-21:00', index: 10 },
  { label: '亥时', range: '21:00-23:00', index: 11 },
  { label: '晚子时', range: '23:00-00:00', index: 12 },
]

export function getWuXingByGan(gan: TianGan): WuXing {
  return GAN_WUXING[gan]
}

export function getWuXingByZhi(zhi: string): WuXing {
  return ZHI_WUXING[zhi as DiZhi] || '土'
}

export function getWuXingBg(wx: WuXing): string {
  return WUXING_BG[wx]
}

export function getWuXingColor(wx: WuXing): string {
  return WUXING_COLOR[wx]
}
