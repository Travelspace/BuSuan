import type { WuXing } from '../../../types'

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

export function getWuXingBg(wx: WuXing): string {
  return WUXING_BG[wx]
}

export function getWuXingColor(wx: WuXing): string {
  return WUXING_COLOR[wx]
}
