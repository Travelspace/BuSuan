/// <reference types="vite/client" />

export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

export type WuXing = '金' | '木' | '水' | '火' | '土'

export type TenGod = 
  | '比肩' 
  | '劫财' 
  | '食神' 
  | '伤官' 
  | '正财' 
  | '偏财' 
  | '正官' 
  | '七杀' 
  | '正印' 
  | '偏印'

export type Gender = 'male' | 'female'

export type CalendarType = 'solar' | 'lunar'

export type ModuleType = 'profile' | 'bazi' | 'ziwei' | 'fortune' | 'name' | 'calendar' | 'liuyao'

export interface BirthInfo {
  name?: string
  date: string
  calendar: CalendarType
  gender: Gender
  location?: string
}

export interface Pillar {
  tianGan: TianGan
  diZhi: DiZhi
  nayin: string
}

export interface HiddenStem {
  tianGan: TianGan
  type: '本气' | '中气' | '余气'
  strength: number
}

export interface TenGodRelation {
  position: string
  tianGan: TianGan
  tenGod: TenGod
}

export interface Dayun {
  startAge: number
  endAge: number
  tianGan: TianGan
  diZhi: DiZhi
  tenGod: TenGod
}

export interface Liunian {
  year: number
  tianGan: TianGan
  diZhi: DiZhi
  tenGod: TenGod
}

export interface BaziResult {
  pillars: {
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar
  }
  dayMaster: TianGan
  tenGods: TenGodRelation[]
  fiveElements: Record<WuXing, number>
  nayin: {
    year: string
    month: string
    day: string
    hour: string
  }
  hiddenStems: {
    year: HiddenStem[]
    month: HiddenStem[]
    day: HiddenStem[]
    hour: HiddenStem[]
  }
  dayun: Dayun[]
  liunian: Liunian[]
  xiYongShen?: {
    xiShen: WuXing[]
    yongShen: WuXing
    jiShen: WuXing[]
  }
}

export interface Palace {
  index: number
  name: string
  tianGan: TianGan
  diZhi: DiZhi
  majorStars: string[]
  minorStars: string[]
  sihua: string[]
}

export interface ZiweiResult {
  palaces: Palace[]
  sihua: {
    lu: { star: string; palace: number }
    quan: { star: string; palace: number }
    ke: { star: string; palace: number }
    ji: { star: string; palace: number }
  }
  mingGongStars: string[]
}

export interface GeInfo {
  name: string
  strokes: number
  wuXing: WuXing
  level: '大吉' | '吉' | '半吉' | '凶' | '大凶'
  meaning: string[]
}

export interface NameResult {
  name: string
  surname: string
  givenName: string
  totalStrokes: number
  fiveGe: {
    tianGe: GeInfo
    renGe: GeInfo
    diGe: GeInfo
    waiGe: GeInfo
    zongGe: GeInfo
  }
  sanCai: {
    tian: WuXing
    ren: WuXing
    di: WuXing
    relation: string
  }
  score: number
  level: 'excellent' | 'good' | 'normal' | 'poor' | 'bad'
  evaluation: {
    advantages: string[]
    disadvantages: string[]
    suggestions: string[]
  }
  baziMatch?: {
    matchScore: number
    wuxingMatch: {
      name: WuXing[]
      bazi: WuXing[]
      match: boolean
    }
    suggestions: string[]
  }
}

export interface YaoInfo {
  position: number
  type: '阳' | '阴'
  isMoving: boolean
  text: string
  explain: string
}

export interface GuaInfo {
  name: string
  fullName: string
  symbol: string
  upperTrigram: string
  lowerTrigram: string
  wuxing: string
  guaci: string
  guaciExplain: string
  yaoci: YaoInfo[]
}

export interface LiuyaoResult {
  divinationTime: Date
  question?: string
  method: 'manual' | 'time'
  benGua: GuaInfo
  huGua: GuaInfo | null
  bianGua: GuaInfo | null
  dongYao: number[]
  tiYong: {
    tiGua: string
    yongGua: string
    relation: '生' | '克' | '比和' | '被生' | '被克'
    isGood: boolean
  }
  interpretation: {
    summary: string
    advice: string
    level: '吉' | '中吉' | '平' | '小凶' | '凶'
  }
}
