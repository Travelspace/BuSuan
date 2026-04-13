import type { NameResult, GeInfo, WuXing, BaziResult } from '../../../types'
import { getStrokeCount } from './strokeLookup'
import { getCharWuXing } from '../data/kangxiStrokes'
import { NUM_WUXING, GE_MEANINGS, SANCAI_RELATIONS } from './constants'

function getStrokesWuXing(strokes: number): WuXing {
  const remainder = strokes % 10
  return NUM_WUXING[remainder === 0 ? 10 : remainder]
}

function getGeInfo(strokes: number, name: string): GeInfo {
  const wuXing = getStrokesWuXing(strokes)
  const info = GE_MEANINGS[strokes]
  if (info) {
    return {
      name,
      strokes,
      wuXing,
      level: info.level,
      meaning: info.meanings,
    }
  }
  const modStrokes = ((strokes - 1) % 80) + 1
  const fallbackInfo = GE_MEANINGS[modStrokes]
  return {
    name,
    strokes,
    wuXing,
    level: fallbackInfo?.level || '半吉',
    meaning: fallbackInfo?.meanings || ['数理待考'],
  }
}

function calculateScore(fiveGe: NameResult['fiveGe'], sanCai: NameResult['sanCai']): number {
  let score = 60

  const levelScores: Record<string, number> = {
    '大吉': 10, '吉': 7, '半吉': 4, '凶': -5, '大凶': -10,
  }

  score += levelScores[fiveGe.tianGe.level] || 0
  score += levelScores[fiveGe.renGe.level] * 2 || 0
  score += levelScores[fiveGe.diGe.level] * 1.5 || 0
  score += levelScores[fiveGe.zongGe.level] * 1.5 || 0
  score += levelScores[fiveGe.waiGe.level] || 0

  const sanCaiKey = `${sanCai.tian}${sanCai.ren}${sanCai.di}`
  const relation = SANCAI_RELATIONS[sanCaiKey]
  if (relation) {
    if (relation.includes('大吉') || relation.includes('顺畅')) {
      score += 10
    } else if (relation.includes('稳固')) {
      score += 7
    } else if (relation.includes('阻碍') || relation.includes('困难')) {
      score -= 8
    } else if (relation.includes('矛盾') || relation.includes('波折')) {
      score -= 5
    } else if (relation.includes('受限')) {
      score -= 6
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

function getScoreLevel(score: number): NameResult['level'] {
  if (score >= 85) return 'excellent'
  if (score >= 70) return 'good'
  if (score >= 50) return 'normal'
  if (score >= 30) return 'poor'
  return 'bad'
}

function getEvaluation(fiveGe: NameResult['fiveGe'], sanCai: NameResult['sanCai'], score: number): NameResult['evaluation'] {
  const advantages: string[] = []
  const disadvantages: string[] = []
  const suggestions: string[] = []

  const geNames = ['tianGe', 'renGe', 'diGe', 'waiGe', 'zongGe'] as const
  const geLabels = { tianGe: '天格', renGe: '人格', diGe: '地格', waiGe: '外格', zongGe: '总格' }

  geNames.forEach(key => {
    const ge = fiveGe[key]
    if (ge.level === '大吉' || ge.level === '吉') {
      advantages.push(`${geLabels[key]}数理为${ge.level}（${ge.strokes}画），${ge.meaning.join('、')}`)
    } else if (ge.level === '凶' || ge.level === '大凶') {
      disadvantages.push(`${geLabels[key]}数理为${ge.level}（${ge.strokes}画），${ge.meaning.join('、')}`)
    }
  })

  const sanCaiKey = `${sanCai.tian}${sanCai.ren}${sanCai.di}`
  const relation = SANCAI_RELATIONS[sanCaiKey]
  if (relation) {
    if (relation.includes('大吉') || relation.includes('顺畅') || relation.includes('稳固')) {
      advantages.push(`三才配置（${sanCai.tian}${sanCai.ren}${sanCai.di}）吉利，${relation}`)
    } else {
      disadvantages.push(`三才配置（${sanCai.tian}${sanCai.ren}${sanCai.di}）欠佳，${relation}`)
    }
  }

  if (fiveGe.renGe.level === '凶' || fiveGe.renGe.level === '大凶') {
    suggestions.push('人格为主运，影响一生，建议改名改善人格数理')
  }
  if (fiveGe.zongGe.level === '凶' || fiveGe.zongGe.level === '大凶') {
    suggestions.push('总格为晚运，影响后半生，建议选择总格吉利的名字')
  }
  if (disadvantages.length > advantages.length) {
    suggestions.push('整体数理欠佳，建议考虑改名，选择五格数理更优的名字')
  }

  return { advantages, disadvantages, suggestions }
}

export function calculateName(
  fullName: string,
  baziResult?: BaziResult | null
): NameResult | null {
  if (!fullName || fullName.trim().length < 2) return null

  const name = fullName.trim()
  const chars = [...name]
  const isCompoundSurname = chars.length > 2 && chars[0] && chars[1]

  let surnameChars: string[]
  let givenNameChars: string[]

  if (chars.length === 2) {
    surnameChars = [chars[0]]
    givenNameChars = [chars[1]]
  } else if (chars.length === 3) {
    surnameChars = [chars[0]]
    givenNameChars = [chars[1], chars[2]]
  } else if (chars.length === 4) {
    surnameChars = [chars[0], chars[1]]
    givenNameChars = [chars[2], chars[3]]
  } else {
    surnameChars = [chars[0]]
    givenNameChars = chars.slice(1)
  }

  const surnameStrokes = surnameChars.map(c => getStrokeCount(c))
  const givenNameStrokes = givenNameChars.map(c => getStrokeCount(c))

  const surnameTotal = surnameStrokes.reduce((a, b) => a + b, 0)
  const givenNameTotal = givenNameStrokes.reduce((a, b) => a + b, 0)
  const allTotal = surnameTotal + givenNameTotal

  const tianGeStrokes = surnameChars.length === 1 ? surnameStrokes[0] + 1 : surnameTotal
  const renGeStrokes = surnameStrokes[surnameStrokes.length - 1] + givenNameStrokes[0]
  const diGeStrokes = givenNameChars.length === 1 ? givenNameStrokes[0] + 1 : givenNameTotal
  const zongGeStrokes = allTotal
  const waiGeStrokes = zongGeStrokes - renGeStrokes + 1

  const tianGe = getGeInfo(tianGeStrokes, '天格')
  const renGe = getGeInfo(renGeStrokes, '人格')
  const diGe = getGeInfo(diGeStrokes, '地格')
  const waiGe = getGeInfo(waiGeStrokes > 0 ? waiGeStrokes : 1, '外格')
  const zongGe = getGeInfo(zongGeStrokes, '总格')

  const fiveGe = { tianGe, renGe, diGe, waiGe, zongGe }

  const sanCai = {
    tian: tianGe.wuXing,
    ren: renGe.wuXing,
    di: diGe.wuXing,
    relation: SANCAI_RELATIONS[`${tianGe.wuXing}${renGe.wuXing}${diGe.wuXing}`] || '三才配置待分析',
  }

  const score = calculateScore(fiveGe, sanCai)
  const level = getScoreLevel(score)
  const evaluation = getEvaluation(fiveGe, sanCai, score)

  const result: NameResult = {
    name,
    surname: surnameChars.join(''),
    givenName: givenNameChars.join(''),
    totalStrokes: allTotal,
    fiveGe,
    sanCai,
    score,
    level,
    evaluation,
  }

  if (baziResult) {
    result.baziMatch = calculateBaziMatch(name, baziResult)
  }

  return result
}

function calculateBaziMatch(name: string, baziResult: BaziResult): NameResult['baziMatch'] {
  const chars = [...name]
  const nameWuXing = chars.map(c => getCharWuXing(c)).filter((wx): wx is WuXing => wx !== '')

  const xiShen = baziResult.xiYongShen?.xiShen || []
  const yongShen = baziResult.xiYongShen?.yongShen
  const jiShen = baziResult.xiYongShen?.jiShen || []

  let matchScore = 50
  const suggestions: string[] = []

  nameWuXing.forEach(wx => {
    if (xiShen.includes(wx)) {
      matchScore += 12
    }
    if (wx === yongShen) {
      matchScore += 15
    }
    if (jiShen.includes(wx)) {
      matchScore -= 10
    }
  })

  const baziWuXing = Object.entries(baziResult.fiveElements)
    .filter(([_, count]) => count > 0)
    .map(([wx]) => wx as WuXing)

  const hasMatch = nameWuXing.some(wx => xiShen.includes(wx) || wx === yongShen)

  if (matchScore >= 80) {
    suggestions.push('姓名五行与八字喜用神高度匹配，非常吉利')
  } else if (matchScore >= 60) {
    suggestions.push('姓名五行与八字喜用神基本匹配，较为有利')
  } else if (matchScore >= 40) {
    suggestions.push('姓名五行与八字喜用神匹配一般，可考虑调整')
  } else {
    suggestions.push('姓名五行与八字喜用神不太匹配，建议改名')
  }

  if (yongShen && !nameWuXing.includes(yongShen)) {
    suggestions.push(`八字用神为${yongShen}，建议姓名中补充${yongShen}属性的字`)
  }

  jiShen.forEach(wx => {
    if (nameWuXing.includes(wx)) {
      suggestions.push(`姓名中含有忌神${wx}属性，可能不利`)
    }
  })

  const missingWuXing = (['金', '木', '水', '火', '土'] as WuXing[])
    .filter(wx => baziResult.fiveElements[wx] === 0)

  missingWuXing.forEach(wx => {
    if (nameWuXing.includes(wx)) {
      suggestions.push(`八字缺${wx}，姓名中含${wx}属性，有补益作用`)
      matchScore += 5
    }
  })

  return {
    matchScore: Math.max(0, Math.min(100, matchScore)),
    wuxingMatch: {
      name: nameWuXing,
      bazi: baziWuXing,
      match: hasMatch,
    },
    suggestions,
  }
}
