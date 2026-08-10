/**
 * 五格计算（从原 calculation.ts 抽出，逻辑完全保留）
 * - 单/复姓、单/双名按字数拆分
 * - 天/人/地/外/总格计算
 * - 81 数理吉凶（GE_MEANINGS）
 * - 三才配置（SANCAI_RELATIONS）
 * - 独立五格得分（沿用原 calculateScore 算法）
 */
import type { GeInfo, WuXing } from '../../../types'
import type { WugeReference } from './types'
import { getStrokeCount } from './strokeLookup'
import { NUM_WUXING, GE_MEANINGS, SANCAI_RELATIONS } from './constants'

/** 笔画→五行（尾数法） */
function getStrokesWuXing(strokes: number): WuXing {
  const remainder = strokes % 10
  return NUM_WUXING[remainder === 0 ? 10 : remainder]
}

/** 构造格信息 */
function getGeInfo(strokes: number, name: string): GeInfo {
  const wuXing = getStrokesWuXing(strokes)
  const info = GE_MEANINGS[strokes]
  if (info) {
    return { name, strokes, wuXing, level: info.level, meaning: info.meanings }
  }
  // 超过 81 时按 ((strokes-1)%80)+1 回退
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

/** 五格集合类型 */
interface FiveGeSet {
  tianGe: GeInfo
  renGe: GeInfo
  diGe: GeInfo
  waiGe: GeInfo
  zongGe: GeInfo
}

/** 独立五格得分（沿用原 calculateScore 算法） */
function calculateWugeScore(fiveGe: FiveGeSet, sanCai: WugeReference['sanCai']): number {
  let score = 60

  const levelScores: Record<string, number> = {
    '大吉': 10, '吉': 7, '半吉': 4, '凶': -5, '大凶': -10,
  }

  score += levelScores[fiveGe.tianGe.level] || 0
  score += (levelScores[fiveGe.renGe.level] || 0) * 2
  score += (levelScores[fiveGe.diGe.level] || 0) * 1.5
  score += (levelScores[fiveGe.zongGe.level] || 0) * 1.5
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

export function calculateWuge(surname: string, givenName: string): WugeReference {
  const surnameChars = [...surname]
  const givenNameChars = [...givenName]

  const surnameStrokes = surnameChars
    .map(c => getStrokeCount(c))
    .filter((s): s is number => s !== null)
  const givenNameStrokes = givenNameChars
    .map(c => getStrokeCount(c))
    .filter((s): s is number => s !== null)

  // 笔画缺失时以 0 兜底（主入口已校验，此处防御）
  const surnameTotal = surnameStrokes.reduce((a, b) => a + b, 0)
  const givenNameTotal = givenNameStrokes.reduce((a, b) => a + b, 0)
  const allTotal = surnameTotal + givenNameTotal

  // 单姓天格 = 姓笔画 + 1；复姓天格 = 姓氏总笔画
  const tianGeStrokes = surnameChars.length === 1
    ? (surnameStrokes[0] ?? 0) + 1
    : surnameTotal
  // 人格 = 姓氏末字 + 名字首字
  const renGeStrokes = (surnameStrokes[surnameStrokes.length - 1] ?? 0) + (givenNameStrokes[0] ?? 0)
  // 单名地格 = 名字笔画 + 1；双名地格 = 名字总笔画
  const diGeStrokes = givenNameChars.length === 1
    ? (givenNameStrokes[0] ?? 0) + 1
    : givenNameTotal
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

  const score = calculateWugeScore(fiveGe, sanCai)

  return { ...fiveGe, sanCai, score }
}
