/**
 * 综合评分计算
 * - 有八字：八字×0.6 + 卦象×0.25 + 五格×0.15
 * - 无八字：卦象×0.5 + 五格×0.5
 * - 等级：≥80 excellent、≥65 good、≥50 normal、<50 poor
 */
import type { NameLevel } from './types'

export interface OverallScoreResult {
  score: number
  level: NameLevel
}

export function calculateOverallScore(
  baziScore: number | null,
  guaScore: number,
  wugeScore: number,
): OverallScoreResult {
  let score: number
  if (baziScore !== null) {
    score = baziScore * 0.6 + guaScore * 0.25 + wugeScore * 0.15
  } else {
    score = guaScore * 0.5 + wugeScore * 0.5
  }

  const rounded = Math.max(0, Math.min(100, Math.round(score)))

  let level: NameLevel
  if (rounded >= 80) level = 'excellent'
  else if (rounded >= 65) level = 'good'
  else if (rounded >= 50) level = 'normal'
  else level = 'poor'

  return { score: rounded, level }
}
