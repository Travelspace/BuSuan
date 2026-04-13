import { Solar, Lunar } from 'lunar-typescript'
import type { BaziResult, WuXing } from '../../../types'
import { ZHI_CHONG, ZHI_SHA } from './constants'

export interface DayInfo {
  solar: { year: number; month: number; day: number }
  lunar: { year: number; month: number; day: number; monthStr: string; dayStr: string }
  ganZhi: { year: string; month: string; day: string }
  weekday: number
  jieQi: string
  shengXiao: string
  chong: string
  sha: string
  yi: string[]
  ji: string[]
  jiShen: string[]
  xiongShen: string[]
  isToday: boolean
  baziRelation?: BaziDayRelation
}

export interface BaziDayRelation {
  dayGanZhi: string
  isChong: boolean
  isHe: boolean
  isSheng: boolean
  isKe: boolean
  chongDesc: string
  heDesc: string
  score: number
  suggestion: string
}

export interface MonthData {
  year: number
  month: number
  days: DayInfo[]
}

const HE_MAP: Record<string, string> = {
  '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午',
}

const GAN_HE_MAP: Record<string, string> = {
  '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙',
  '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊',
}

const GAN_WUXING: Record<string, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
}

const ZHI_WUXING: Record<string, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

const SHENG_MAP: Record<WuXing, WuXing> = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
const KE_MAP: Record<WuXing, WuXing> = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }

function getBaziDayRelation(dayGanZhi: string, baziResult: BaziResult): BaziDayRelation {
  const dayGan = dayGanZhi[0]
  const dayZhi = dayGanZhi[1]
  const baziDayGan = baziResult.dayMaster
  const baziDayZhi = baziResult.pillars.day.diZhi

  let isChong = false
  let isHe = false
  let isSheng = false
  let isKe = false
  let score = 50
  const chongDesc: string[] = []
  const heDesc: string[] = []

  if (ZHI_CHONG[dayZhi] === baziDayZhi || ZHI_CHONG[baziDayZhi] === dayZhi) {
    isChong = true
    score -= 20
    chongDesc.push(`日支${dayZhi}与八字日支${baziDayZhi}相冲`)
  }

  if (HE_MAP[dayZhi] === baziDayZhi) {
    isHe = true
    score += 15
    heDesc.push(`日支${dayZhi}与八字日支${baziDayZhi}相合`)
  }

  const dayWx = GAN_WUXING[dayGan]
  const baziWx = GAN_WUXING[baziDayGan]
  if (dayWx && baziWx) {
    if (SHENG_MAP[dayWx] === baziWx) {
      isSheng = true
      score += 10
      heDesc.push(`日干${dayGan}(${dayWx})生八字日干${baziDayGan}(${baziWx})`)
    }
    if (KE_MAP[dayWx] === baziWx) {
      isKe = true
      score -= 15
      chongDesc.push(`日干${dayGan}(${dayWx})克八字日干${baziDayGan}(${baziWx})`)
    }
    if (dayWx === baziWx) {
      score += 8
      heDesc.push(`日干${dayGan}与八字日干${baziDayGan}五行相同`)
    }
  }

  if (GAN_HE_MAP[dayGan] === baziDayGan) {
    isHe = true
    score += 12
    heDesc.push(`日干${dayGan}与八字日干${baziDayGan}天干相合`)
  }

  const xiShen = baziResult.xiYongShen?.xiShen || []
  const yongShen = baziResult.xiYongShen?.yongShen
  const jiShen = baziResult.xiYongShen?.jiShen || []

  if (dayWx && xiShen.includes(dayWx)) {
    score += 10
    heDesc.push(`日干五行${dayWx}为八字喜神`)
  }
  if (dayWx && dayWx === yongShen) {
    score += 12
    heDesc.push(`日干五行${dayWx}为八字用神`)
  }
  if (dayWx && jiShen.includes(dayWx)) {
    score -= 8
    chongDesc.push(`日干五行${dayWx}为八字忌神`)
  }

  const dayZhiWx = ZHI_WUXING[dayZhi]
  if (dayZhiWx && xiShen.includes(dayZhiWx)) {
    score += 5
  }

  score = Math.max(0, Math.min(100, score))

  let suggestion = ''
  if (score >= 75) {
    suggestion = '此日与八字非常相合，适合重要事项'
  } else if (score >= 55) {
    suggestion = '此日与八字较为相合，可以进行一般事项'
  } else if (score >= 40) {
    suggestion = '此日与八字关系一般，建议谨慎行事'
  } else {
    suggestion = '此日与八字相冲，建议避开此日'
  }

  return {
    dayGanZhi,
    isChong,
    isHe,
    isSheng,
    isKe,
    chongDesc: chongDesc.join('；'),
    heDesc: heDesc.join('；'),
    score,
    suggestion,
  }
}

export function getMonthData(year: number, month: number, baziResult?: BaziResult | null): MonthData {
  const days: DayInfo[] = []
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const today = new Date()

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const solar = Solar.fromYmd(year, month, d)
    const lunar = solar.getLunar()

    const dayGanZhi = lunar.getDayGan() + lunar.getDayZhi()

    const yi = lunar.getDayYi()
    const ji = lunar.getDayJi()

    const jiShen: string[] = []
    const xiongShen: string[] = []

    const dayJiShen = lunar.getDayJiShen()
    const dayXiongSha = lunar.getDayXiongSha()
    jiShen.push(...dayJiShen)
    xiongShen.push(...dayXiongSha)

    const dayZhi = lunar.getDayZhi()
    const chong = ZHI_CHONG[dayZhi] || ''
    const sha = ZHI_SHA[dayZhi] || ''

    const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === d

    const dayInfo: DayInfo = {
      solar: { year, month, day: d },
      lunar: {
        year: lunar.getYear(),
        month: lunar.getMonth(),
        day: lunar.getDay(),
        monthStr: lunar.getMonthInChinese(),
        dayStr: lunar.getDayInChinese(),
      },
      ganZhi: {
        year: lunar.getYearGan() + lunar.getYearZhi(),
        month: lunar.getMonthGan() + lunar.getMonthZhi(),
        day: dayGanZhi,
      },
      weekday: solar.getWeek(),
      jieQi: lunar.getJieQi() || '',
      shengXiao: lunar.getShengxiao(),
      chong: chong ? `冲${chong}` : '',
      sha,
      yi: yi.map(String),
      ji: ji.map(String),
      jiShen,
      xiongShen,
      isToday,
    }

    if (baziResult) {
      dayInfo.baziRelation = getBaziDayRelation(dayGanZhi, baziResult)
    }

    days.push(dayInfo)
  }

  return { year, month, days }
}

export function filterAuspiciousDays(monthData: MonthData, eventType: string): DayInfo[] {
  const eventLabelMap: Record<string, string[]> = {
    'marriage': ['嫁娶', '纳采', '订盟'],
    'business': ['开市', '开业', '交易', '立券'],
    'move': ['移徙', '入宅', '搬家', '安床'],
    'groundbreaking': ['动土', '破土', '修造'],
    'burial': ['安葬', '入殓', '破土'],
    'travel': ['出行', '移徙', '远行'],
    'contract': ['签约', '立券', '交易', '纳财'],
    'sacrifice': ['祭祀', '祈福', '斋醮'],
  }

  const keywords = eventLabelMap[eventType] || [eventType]

  return monthData.days.filter(day => {
    const hasYi = day.yi.some(y => keywords.some(k => y.includes(k)))
    const hasJiConflict = day.ji.some(j => keywords.some(k => j.includes(k)))
    return hasYi && !hasJiConflict
  })
}
