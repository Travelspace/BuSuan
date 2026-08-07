export const FORTUNE_LEVELS = ['大吉', '吉', '平', '凶', '大凶'] as const

export const JI_XIONG_LEVELS = ['大吉', '吉', '半吉', '凶', '大凶'] as const

export const LEVEL_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  '大吉': { text: 'text-red', bg: 'bg-red/15', border: 'border-red/30' },
  '吉': { text: 'text-wood', bg: 'bg-wood/15', border: 'border-wood/30' },
  '平': { text: 'text-gold', bg: 'bg-gold/15', border: 'border-gold/30' },
  '半吉': { text: 'text-gold', bg: 'bg-gold/15', border: 'border-gold/30' },
  '凶': { text: 'text-water', bg: 'bg-water/15', border: 'border-water/30' },
  '大凶': { text: 'text-text-muted', bg: 'bg-text-muted/15', border: 'border-text-muted/30' },
}

export const LEVEL_SCORE: Record<string, number> = {
  '大吉': 5,
  '吉': 4,
  '平': 3,
  '凶': 2,
  '大凶': 1,
}
