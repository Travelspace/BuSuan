/**
 * 姓名测算主入口（重写）
 * 核心逻辑：八字派为主、卦象派为辅，五格作为参考信息
 *
 * 编排流程：
 *   1. 校验姓名（≥2 字）
 *   2. 调 calculateGua（始终执行）
 *   3. 调 calculateWuge（始终执行）
 *   4. 若 baziResult 存在，调 calculateBaziMatch；否则 baziAnalysis=null、baziMissing=true
 *   5. 调 calculateOverallScore（自动按八字有无切换权重）
 *   6. 返回 NameCalcResult
 */
import type { NameInput, NameCalcResult } from './types'
import { calculateGua } from './guaAnalysis'
import { calculateWuge } from './wugeCalculation'
import { calculateBaziMatch } from './baziMatch'
import { calculateOverallScore } from './scoreCalculator'

export function calculateName(input: NameInput): NameCalcResult | null {
  const surname = input.surname.trim()
  const givenName = input.givenName.trim()
  const fullName = `${surname}${givenName}`

  // 1. 校验姓名（≥2 字）
  if ([...fullName].length < 2) return null

  // 2. 卦象分析（始终执行）
  const guaAnalysis = calculateGua(surname, givenName)

  // 3. 五格参考（始终执行）
  const wugeReference = calculateWuge(surname, givenName)

  // 4. 八字匹配（有则分析，无则置空并标记）
  let baziAnalysis = null
  let baziMissing = false
  if (input.baziResult) {
    baziAnalysis = calculateBaziMatch(surname, givenName, input.baziResult)
  } else {
    baziMissing = true
  }

  // 5. 综合评分（按八字有无切换权重）
  const { score, level } = calculateOverallScore(
    baziAnalysis?.matchScore ?? null,
    guaAnalysis.score,
    wugeReference.score,
  )

  // 6. 返回结果
  return {
    name: fullName,
    surname,
    givenName,
    baziAnalysis,
    guaAnalysis,
    wugeReference,
    overallScore: score,
    level,
    baziMissing,
  }
}
