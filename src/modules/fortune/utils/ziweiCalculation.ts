import type { BirthInfo } from '../../../types'
import type { ZiweiPalaceData, ZiweiCalcResult } from '../../ziwei/utils/calculation'
import { getScoreLevel, type FortuneLevel } from './constants'

export interface PalaceFortune {
  name: string
  index: number
  heavenlyStem: string
  earthlyBranch: string
  majorStars: string[]
  minorStars: string[]
  sihua: string[]
  isBodyPalace: boolean
  decadal: {
    range: [number, number]
    heavenlyStem: string
    earthlyBranch: string
  }
  score: number
  level: FortuneLevel
  analysis: string
  advice: string
}

export interface ZiweiFortuneResult {
  birthInfo: BirthInfo
  soulStar: string
  bodyStar: string
  fiveElementsClass: string
  zodiac: string
  sign: string
  palaces: PalaceFortune[]
  sihua: {
    lu: { star: string; palace: number; palaceName: string }
    quan: { star: string; palace: number; palaceName: string }
    ke: { star: string; palace: number; palaceName: string }
    ji: { star: string; palace: number; palaceName: string }
  }
  currentDecadal: {
    palaceName: string
    range: [number, number]
    ganZhi: string
    majorStars: string[]
  } | null
  currentAge: number
  overallScore: number
  overallLevel: FortuneLevel
}

const PALACE_DOMAIN: Record<string, { domain: string; icon: string; weight: number }> = {
  '命宫': { domain: '性格命运', icon: '👤', weight: 15 },
  '兄弟宫': { domain: '人际社交', icon: '🤝', weight: 8 },
  '夫妻宫': { domain: '婚姻感情', icon: '❤️', weight: 12 },
  '子女宫': { domain: '子女晚辈', icon: '👶', weight: 8 },
  '财帛宫': { domain: '财运理财', icon: '💰', weight: 12 },
  '疾厄宫': { domain: '健康体质', icon: '🏥', weight: 10 },
  '迁移宫': { domain: '外出变动', icon: '✈️', weight: 8 },
  '仆役宫': { domain: '朋友下属', icon: '👥', weight: 7 },
  '官禄宫': { domain: '事业学业', icon: '💼', weight: 12 },
  '田宅宫': { domain: '房产家庭', icon: '🏠', weight: 8 },
  '福德宫': { domain: '精神福分', icon: '🧘', weight: 8 },
  '父母宫': { domain: '长辈缘份', icon: '👨‍👩‍👧', weight: 7 },
}

const STAR_SCORES: Record<string, number> = {
  '紫微': 85, '天府': 80, '太阳': 75, '太阴': 75,
  '天相': 70, '天梁': 70, '武曲': 70, '天同': 70,
  '天机': 65, '贪狼': 55, '廉贞': 50, '巨门': 45,
  '七杀': 45, '破军': 40,
}

const SIHUA_SCORE_ADJUST: Record<string, number> = {
  '禄': 15, '权': 10, '科': 8, '忌': -18,
}

function calculatePalaceScore(palace: ZiweiPalaceData): number {
  let score = 50

  if (palace.majorStars.length > 0) {
    const mainStarScore = palace.majorStars
      .map(s => STAR_SCORES[s] || 50)
      .reduce((a, b) => a + b, 0) / palace.majorStars.length
    score = mainStarScore
  }

  for (const sh of palace.sihua) {
    const mutagen = sh.split('·')[1]
    if (mutagen && SIHUA_SCORE_ADJUST[mutagen]) {
      score += SIHUA_SCORE_ADJUST[mutagen]
    }
  }

  if (palace.minorStars.some(s => ['左辅', '右弼', '文昌', '文曲'].includes(s))) {
    score += 5
  }
  if (palace.minorStars.some(s => ['擎羊', '陀罗', '火星', '铃星'].includes(s))) {
    score -= 8
  }

  return Math.max(0, Math.min(100, score))
}

function generatePalaceAnalysis(
  palaceName: string,
  majorStars: string[],
  sihua: string[],
  score: number,
  level: PalaceFortune['level']
): { analysis: string; advice: string } {
  const domain = PALACE_DOMAIN[palaceName]
  const domainText = domain?.domain || '此领域'

  const starText = majorStars.length > 0
    ? majorStars.join('、') + '坐守'
    : '无主星坐守'

  const hasJi = sihua.some(s => s.includes('忌'))
  const hasLu = sihua.some(s => s.includes('禄'))
  const hasQuan = sihua.some(s => s.includes('权'))
  const hasKe = sihua.some(s => s.includes('科'))

  let analysis = `${domainText}方面，${starText}`
  if (hasLu) analysis += '，化禄带来机遇与财缘'
  if (hasQuan) analysis += '，化权增强掌控力'
  if (hasKe) analysis += '，化科带来名声与贵人'
  if (hasJi) analysis += '，化忌需防阻碍与执念'
  if (!hasLu && !hasJi && !hasQuan && !hasKe) {
    analysis += '，运势平稳'
  }

  const adviceMap: Record<string, string> = {
    '大吉': `把握良机，${domainText}方面可积极进取`,
    '吉': `稳中求进，${domainText}方面运势不错`,
    '平': `保持平稳，${domainText}方面不宜冒进`,
    '凶': `谨慎行事，${domainText}方面需防波折`,
    '大凶': `韬光养晦，${domainText}方面宜守不宜攻`,
  }

  return {
    analysis,
    advice: adviceMap[level],
  }
}

export function calculateZiweiFortune(
  ziweiResult: ZiweiCalcResult,
  birthInfo: BirthInfo
): ZiweiFortuneResult | null {
  if (!birthInfo.date) return null

  const date = new Date(birthInfo.date)
  const year = date.getFullYear()
  const currentAge = new Date().getFullYear() - year

  const palaces = ziweiResult.palaces

  const palaceNameByIndex = (index: number) =>
    palaces.find(p => p.index === index)?.name || ''

  const sihua = {
    lu: { star: ziweiResult.sihua.lu.star, palace: ziweiResult.sihua.lu.palace, palaceName: palaceNameByIndex(ziweiResult.sihua.lu.palace) },
    quan: { star: ziweiResult.sihua.quan.star, palace: ziweiResult.sihua.quan.palace, palaceName: palaceNameByIndex(ziweiResult.sihua.quan.palace) },
    ke: { star: ziweiResult.sihua.ke.star, palace: ziweiResult.sihua.ke.palace, palaceName: palaceNameByIndex(ziweiResult.sihua.ke.palace) },
    ji: { star: ziweiResult.sihua.ji.star, palace: ziweiResult.sihua.ji.palace, palaceName: palaceNameByIndex(ziweiResult.sihua.ji.palace) },
  }

  let currentDecadal: ZiweiFortuneResult['currentDecadal'] = null
  for (const p of palaces) {
    if (p.decadal && p.decadal.range[0] > 0) {
      if (currentAge >= p.decadal.range[0] && currentAge <= p.decadal.range[1]) {
        currentDecadal = {
          palaceName: p.name,
          range: p.decadal.range,
          ganZhi: p.decadal.heavenlyStem + p.decadal.earthlyBranch,
          majorStars: p.majorStars,
        }
        break
      }
    }
  }

  const palaceFortunes: PalaceFortune[] = palaces.map(p => {
    const score = calculatePalaceScore(p)
    const level = getScoreLevel(score)
    const { analysis, advice } = generatePalaceAnalysis(p.name, p.majorStars, p.sihua, score, level)
    return {
      name: p.name,
      index: p.index,
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: p.majorStars,
      minorStars: p.minorStars,
      sihua: p.sihua,
      isBodyPalace: p.isBodyPalace,
      decadal: p.decadal,
      score,
      level,
      analysis,
      advice,
    }
  })

  let overallScore = 0
  let totalWeight = 0
  for (const pf of palaceFortunes) {
    const weight = PALACE_DOMAIN[pf.name]?.weight || 5
    overallScore += pf.score * weight
    totalWeight += weight
  }
  overallScore = totalWeight > 0 ? Math.round(overallScore / totalWeight) : 50

  return {
    birthInfo,
    soulStar: ziweiResult.soul || '',
    bodyStar: ziweiResult.body || '',
    fiveElementsClass: ziweiResult.fiveElementsClass || '',
    zodiac: ziweiResult.zodiac || '',
    sign: ziweiResult.sign || '',
    palaces: palaceFortunes,
    sihua,
    currentDecadal,
    currentAge,
    overallScore,
    overallLevel: getScoreLevel(overallScore),
  }
}
