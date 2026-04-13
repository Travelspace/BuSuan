import cnchar from 'cnchar'
import { ZIDIAN_STROKES } from '../data/zidianStrokes'
import { KANGXI_STROKES } from '../data/kangxiStrokes'

const MAX_REASONABLE_STROKE = 50

const RADICAL_STROKES: Record<string, number> = {
  '阝': 2,
  '辶': 3,
  '廴': 2,
  '氵': 3,
  '忄': 3,
  '扌': 3,
  '犭': 3,
  '饣': 3,
  '纟': 3,
  '礻': 4,
  '衤': 5,
  '钅': 5,
  '罒': 5,
  '疒': 5,
  '癶': 5,
  '虍': 6,
  '西': 6,
  '覀': 6,
}

const NUMBER_STROKES: Record<string, number> = {
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
  '六': 4, '七': 2, '八': 2, '九': 2, '十': 2,
  '百': 6, '千': 3, '万': 3, '零': 13,
}

function getPredefinedStroke(char: string): number | null {
  if (RADICAL_STROKES[char] !== undefined) return RADICAL_STROKES[char]
  if (NUMBER_STROKES[char] !== undefined) return NUMBER_STROKES[char]
  return null
}

function isValidStroke(n: number): boolean {
  return Number.isInteger(n) && n > 0 && n <= MAX_REASONABLE_STROKE
}

function getCncharStroke(char: string): number | null {
  try {
    const result = cnchar.stroke(char)
    if (typeof result === 'number' && isValidStroke(result)) return result
    if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'number' && isValidStroke(result[0])) {
      return result[0]
    }
  } catch {
    // cnchar query failed
  }
  return null
}

function getZidianStroke(char: string): number | null {
  const stroke = ZIDIAN_STROKES[char]
  if (stroke !== undefined && isValidStroke(stroke)) return stroke
  return null
}

function getKangxiStrokeFallback(char: string): number | null {
  const stroke = KANGXI_STROKES[char]
  if (stroke !== undefined && isValidStroke(stroke)) return stroke
  return null
}

export function getStrokeCount(char: string): number {
  const predefined = getPredefinedStroke(char)
  if (predefined !== null) return predefined

  const cncharStroke = getCncharStroke(char)
  if (cncharStroke !== null) return cncharStroke

  const zidianStroke = getZidianStroke(char)
  if (zidianStroke !== null) return zidianStroke

  const kangxiStroke = getKangxiStrokeFallback(char)
  if (kangxiStroke !== null) return kangxiStroke

  return 1
}
