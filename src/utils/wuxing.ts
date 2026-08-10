import type { WuXing, TianGan, DiZhi, TenGod } from '../types'

export const GAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
}

export const ZHI_WUXING: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土',
  '寅': '木', '卯': '木',
  '辰': '土', '巳': '火',
  '午': '火', '未': '土',
  '申': '金', '酉': '金',
  '戌': '土', '亥': '水',
}

export const WU_XING_SHENG: Record<WuXing, WuXing> = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
}

export const WU_XING_KE: Record<WuXing, WuXing> = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
}

export function getWuXingByGan(gan: TianGan): WuXing {
  return GAN_WUXING[gan]
}

export function getWuXingByZhi(zhi: DiZhi): WuXing {
  return ZHI_WUXING[zhi]
}

export function wuXingRelation(wx1: WuXing, wx2: WuXing): '生' | '克' | '比和' | '被生' | '被克' {
  if (wx1 === wx2) return '比和'
  if (WU_XING_SHENG[wx1] === wx2) return '生'
  if (WU_XING_KE[wx1] === wx2) return '克'
  if (WU_XING_SHENG[wx2] === wx1) return '被生'
  return '被克'
}

export function getShengWo(wx: WuXing): WuXing {
  const entries = Object.entries(WU_XING_SHENG) as [WuXing, WuXing][]
  const found = entries.find(([, child]) => child === wx)
  return found ? found[0] : wx
}

export function getKeWo(wx: WuXing): WuXing {
  const entries = Object.entries(WU_XING_KE) as [WuXing, WuXing][]
  const found = entries.find(([, child]) => child === wx)
  return found ? found[0] : wx
}

/**
 * 十神推导：以日干为基准，判定目标天干对应的十神
 * 同干为比肩；同五行同阴阳为比肩、同五行异阴阳为劫财；
 * 日干生目标为食神/伤官，日干克目标为偏财/正财，
 * 目标生日干为偏印/正印，目标克日干为七杀/正官（按阴阳异同区分）
 */
export function getTenGodByGan(dayGan: TianGan, targetGan: TianGan): TenGod {
  if (dayGan === targetGan) return '比肩'

  const dayYinYang = '甲丙戊庚壬'.includes(dayGan)
  const targetYinYang = '甲丙戊庚壬'.includes(targetGan)
  const isSameYinYang = dayYinYang === targetYinYang

  const dayWx = GAN_WUXING[dayGan]
  const targetWx = GAN_WUXING[targetGan]

  if (WU_XING_SHENG[dayWx] === targetWx) return isSameYinYang ? '食神' : '伤官'
  if (WU_XING_KE[dayWx] === targetWx) return isSameYinYang ? '偏财' : '正财'
  if (WU_XING_SHENG[targetWx] === dayWx) return isSameYinYang ? '偏印' : '正印'
  if (WU_XING_KE[targetWx] === dayWx) return isSameYinYang ? '七杀' : '正官'

  return isSameYinYang ? '比肩' : '劫财'
}

/** 八卦→五行：乾/兑金、震/巽木、坎水、离火、坤/艮土 */
export const TRIGRAM_WUXING: Record<string, WuXing> = {
  '乾': '金', '坤': '土', '震': '木', '巽': '木',
  '坎': '水', '离': '火', '艮': '土', '兑': '金',
}
