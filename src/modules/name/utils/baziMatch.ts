/**
 * 八字匹配分析（复用 store 中已计算的 baziResult）
 * 计分规则：
 *   - 基础分 50
 *   - 含喜神 +12，含用神 +15，含忌神 -10
 *   - 补益八字所缺五行 +5（所缺 = baziResult.fiveElements 中 count===0 的五行）
 *   - 限 0-100
 * matchScore < 60 时从喜用神中选取推荐五行方向写入 suggestions
 */
import type { WuXing, BaziResult } from '../../../types'
import type { BaziAnalysis } from './types'
import { getCharWuXing } from './wuxingLookup'

const ALL_WUXING: WuXing[] = ['金', '木', '水', '火', '土']

export function calculateBaziMatch(
  surname: string,
  givenName: string,
  baziResult: BaziResult,
): BaziAnalysis {
  const chars = [...surname, ...givenName]
  const nameWuXing = chars.map(c => getCharWuXing(c))

  const xiShen = baziResult.xiYongShen?.xiShen ?? []
  const yongShen = baziResult.xiYongShen?.yongShen ?? null
  const jiShen = baziResult.xiYongShen?.jiShen ?? []

  const details: string[] = []
  let matchScore = 50

  // 逐字评分与说明
  chars.forEach((char, idx) => {
    const wx = nameWuXing[idx]
    if (!wx) {
      details.push(`「${char}」五行未能识别，不计分`)
      return
    }
    const gains: string[] = []
    const losses: string[] = []
    if (xiShen.includes(wx)) {
      matchScore += 12
      gains.push('与喜神一致 +12')
    }
    if (yongShen === wx) {
      matchScore += 15
      gains.push('与用神一致 +15')
    }
    if (jiShen.includes(wx)) {
      matchScore -= 10
      losses.push('与忌神冲突 -10')
    }
    const tag = gains.length > 0 ? gains.join('、') : losses.join('、')
    details.push(`「${char}」属${wx}${tag ? `，${tag}` : ''}`)
  })

  // 八字所缺五行
  const missingWuXing = ALL_WUXING.filter(wx => (baziResult.fiveElements[wx] ?? 0) === 0)
  missingWuXing.forEach(wx => {
    if (nameWuXing.includes(wx)) {
      matchScore += 5
      details.push(`八字缺${wx}，姓名中含${wx}属性，有补益作用 +5`)
    }
  })

  matchScore = Math.max(0, Math.min(100, matchScore))

  // 建议生成
  const suggestions: string[] = []
  if (matchScore >= 80) {
    suggestions.push('姓名五行与八字喜用神高度匹配，非常吉利')
  } else if (matchScore >= 60) {
    suggestions.push('姓名五行与八字喜用神基本匹配，较为有利')
  } else {
    suggestions.push('姓名五行与八字喜用神匹配欠佳，建议调整')
  }

  // 低于 60 分时推荐喜用神方向
  if (matchScore < 60) {
    const recommend = [yongShen, ...xiShen].filter((wx): wx is WuXing => wx !== null)
    const uniqueRecommend = Array.from(new Set(recommend))
    if (uniqueRecommend.length > 0) {
      suggestions.push(`建议姓名中补充${uniqueRecommend.join('、')}属性的字以契合喜用神`)
    }
  }

  // 用神未补
  if (yongShen && !nameWuXing.includes(yongShen)) {
    suggestions.push(`八字用神为${yongShen}，建议姓名中补充${yongShen}属性的字`)
  }

  // 忌神出现
  jiShen.forEach(wx => {
    if (nameWuXing.includes(wx)) {
      suggestions.push(`姓名中含有忌神${wx}属性，可能不利`)
    }
  })

  return {
    matchScore,
    nameWuXing,
    xiYongUsed: { xiShen, yongShen, jiShen },
    missingWuXing,
    details,
    suggestions,
  }
}
