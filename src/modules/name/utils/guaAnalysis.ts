/**
 * 卦象起卦与体用分析
 *
 * 起卦（用康熙笔画，复用 getStrokeCount）：
 *   - 上卦 = 姓氏笔画数 % 8（余 0 为坤，即 8）
 *   - 下卦 = 名字总笔画数 % 8（余 0 为坤）
 *   - 动爻 = 总笔画数 % 6（余 0 为 6）
 *
 * 八卦序：1乾 2兑 3离 4震 5巽 6坎 7艮 8坤
 * 八卦五行：乾/兑→金，震/巽→木，坎→水，离→火，坤/艮→土
 *
 * 体用关系（体=上卦，用=下卦）：
 *   用生体 / 体生用 / 体克用 / 用克体 / 比和（同五行）
 *
 * 评分：基础 60；用生体 +20、体克用 +10、比和 +5、体生用 -10、用克体 -20；限 0-100
 */
import type { WuXing } from '../../../types'
import type { GuaAnalysis, TiYongRelation } from './types'
import { getStrokeCount } from './strokeLookup'
import { GUA_INTERPRETATION } from '../data/guaInterpretation'
import { TRIGRAM_WUXING, WU_XING_SHENG, WU_XING_KE } from '../../../utils/wuxing'

/** 八卦序号→卦名 */
const GUA_NAMES = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'] as const

/** 笔画数转八卦序号（1-8，余0取8即坤） */
function strokesToGuaIndex(strokes: number): number {
  const mod = strokes % 8
  return mod === 0 ? 8 : mod
}

/** 计算体用关系（体=上卦五行，用=下卦五行） */
function getTiYong(tiWx: WuXing, yongWx: WuXing): { relation: TiYongRelation; desc: string } {
  if (tiWx === yongWx) {
    return { relation: '比和', desc: '体用同五行，比和相助，势均力敌' }
  }
  if (WU_XING_SHENG[yongWx] === tiWx) {
    return { relation: '用生体', desc: '用卦生体卦，有扶助之恩，谋事可成' }
  }
  if (WU_XING_SHENG[tiWx] === yongWx) {
    return { relation: '体生用', desc: '体卦生用卦，泄气之象，劳而少得' }
  }
  if (WU_XING_KE[tiWx] === yongWx) {
    return { relation: '体克用', desc: '体卦克用卦，我制于物，事半功倍' }
  }
  // WU_XING_KE[yongWx] === tiWx
  return { relation: '用克体', desc: '用卦克体卦，受制于人，谋事多艰' }
}

/** 评分：基础 60，按体用关系加减 */
function calcGuaScore(relation: TiYongRelation): number {
  let score = 60
  switch (relation) {
    case '用生体': score += 20; break
    case '体克用': score += 10; break
    case '比和': score += 5; break
    case '体生用': score -= 10; break
    case '用克体': score -= 20; break
  }
  return Math.max(0, Math.min(100, score))
}

export function calculateGua(surname: string, givenName: string): GuaAnalysis {
  // 姓氏笔画数（康熙）
  const surnameStrokes = [...surname]
    .map(c => getStrokeCount(c))
    .reduce<number>((sum, s) => sum + (s ?? 0), 0)
  // 名字总笔画数
  const givenNameStrokes = [...givenName]
    .map(c => getStrokeCount(c))
    .reduce<number>((sum, s) => sum + (s ?? 0), 0)
  // 总笔画数（姓+名）
  const totalStrokes = surnameStrokes + givenNameStrokes

  // 起卦
  const upperIdx = strokesToGuaIndex(surnameStrokes)
  const lowerIdx = strokesToGuaIndex(givenNameStrokes)
  // 动爻（余 0 为 6）
  const dongMod = totalStrokes % 6
  const dongYao = dongMod === 0 ? 6 : dongMod

  const upperGua = GUA_NAMES[upperIdx - 1]
  const lowerGua = GUA_NAMES[lowerIdx - 1]

  // 体用关系（体=上卦，用=下卦）
  const tiWx = TRIGRAM_WUXING[upperGua]
  const yongWx = TRIGRAM_WUXING[lowerGua]
  const { relation, desc } = getTiYong(tiWx, yongWx)

  // 卦名/卦辞
  const key = `${upperGua}${lowerGua}`
  const guaInfo = GUA_INTERPRETATION[key]
  const guaName = guaInfo?.name ?? `${upperGua}${lowerGua}卦`
  const guaText = guaInfo?.text ?? '卦辞待考'

  const score = calcGuaScore(relation)

  return {
    upperGua,
    lowerGua,
    dongYao,
    guaName,
    guaText,
    tiYong: relation,
    tiYongDesc: desc,
    score,
  }
}
