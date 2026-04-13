export const LEVEL_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  '大吉': { text: 'text-red', bg: 'bg-red/15', border: 'border-red/30' },
  '吉': { text: 'text-wood', bg: 'bg-wood/15', border: 'border-wood/30' },
  '平': { text: 'text-gold', bg: 'bg-gold/15', border: 'border-gold/30' },
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

export const DIMENSION_LABELS: Record<string, string> = {
  career: '事业运',
  wealth: '财运',
  love: '感情运',
  health: '健康运',
}

export const DIMENSION_ICONS: Record<string, string> = {
  career: '💼',
  wealth: '💰',
  love: '❤️',
  health: '🏥',
}

export const TREND_LABELS: Record<string, { text: string; desc: string }> = {
  '上升': { text: '📈 上升趋势', desc: '未来运势逐步走高，把握机遇' },
  '平稳': { text: '➡️ 平稳趋势', desc: '运势起伏不大，稳中求进' },
  '波动': { text: '〰️ 波动趋势', desc: '运势起伏较大，需灵活应对' },
  '下降': { text: '📉 下降趋势', desc: '运势逐步走低，宜守不宜攻' },
}
