import type { WuXing } from '../../../types'

export const GE_LEVEL_COLORS: Record<string, string> = {
  '大吉': 'text-wood',
  '吉': 'text-water',
  '半吉': 'text-gold',
  '凶': 'text-fire',
  '大凶': 'text-red-500',
}

export const GE_LEVEL_BG: Record<string, string> = {
  '大吉': 'bg-wood/20',
  '吉': 'bg-water/20',
  '半吉': 'bg-gold/20',
  '凶': 'bg-fire/20',
  '大凶': 'bg-red-500/20',
}

export const WUXING_COLORS: Record<WuXing, string> = {
  '金': 'text-metal',
  '木': 'text-wood',
  '水': 'text-water',
  '火': 'text-fire',
  '土': 'text-earth',
}

export const WUXING_BG_COLORS: Record<WuXing, string> = {
  '金': 'bg-metal/20',
  '木': 'bg-wood/20',
  '水': 'bg-water/20',
  '火': 'bg-fire/20',
  '土': 'bg-earth/20',
}

export const NUM_WUXING: Record<number, WuXing> = {
  1: '木', 2: '木',
  3: '火', 4: '火',
  5: '土', 6: '土',
  7: '金', 8: '金',
  9: '水', 0: '水',
}
