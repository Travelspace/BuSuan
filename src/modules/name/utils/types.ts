/**
 * 姓名测算类型定义
 * 重构后核心逻辑：八字派为主、卦象派为辅，五格作为参考信息
 */
import type { WuXing, GeInfo, BaziResult } from '../../../types'

/** 体用关系类型 */
export type TiYongRelation = '用生体' | '体生用' | '体克用' | '用克体' | '比和'

/** 等级类型（与综合评分对应） */
export type NameLevel = 'excellent' | 'good' | 'normal' | 'poor'

/** 姓名测算输入 */
export interface NameInput {
  surname: string
  givenName: string
  /** 复用 store 的 baziResult；缺失则跳过八字分析 */
  baziResult?: BaziResult | null
}

/** 八字匹配结果 */
export interface BaziAnalysis {
  matchScore: number
  /** 每字五行 */
  nameWuXing: (WuXing | null)[]
  xiYongUsed: { xiShen: WuXing[]; yongShen: WuXing | null; jiShen: WuXing[] }
  /** 八字所缺五行 */
  missingWuXing: WuXing[]
  /** 逐项说明 */
  details: string[]
  suggestions: string[]
}

/** 卦象分析结果 */
export interface GuaAnalysis {
  /** 上卦名（乾兑离震巽坎艮坤） */
  upperGua: string
  /** 下卦名 */
  lowerGua: string
  /** 动爻 1-6 */
  dongYao: number
  /** 64 卦名 */
  guaName: string
  /** 卦辞 */
  guaText: string
  /** 体用关系 */
  tiYong: TiYongRelation
  /** 体用关系说明 */
  tiYongDesc: string
  score: number
}

/** 三才参考 */
export interface SanCaiInfo {
  tian: WuXing
  ren: WuXing
  di: WuXing
  relation: string
}

/** 五格参考（保留原结构，仅作参考） */
export interface WugeReference {
  tianGe: GeInfo
  renGe: GeInfo
  diGe: GeInfo
  waiGe: GeInfo
  zongGe: GeInfo
  sanCai: SanCaiInfo
  score: number
}

/** 综合结果 */
export interface NameCalcResult {
  name: string
  surname: string
  givenName: string
  /** 八字匹配结果，无八字时为 null */
  baziAnalysis: BaziAnalysis | null
  guaAnalysis: GuaAnalysis
  wugeReference: WugeReference
  overallScore: number
  level: NameLevel
  /** 八字缺失时权重调整提示 */
  baziMissing?: boolean
}
