import { Solar } from 'lunar-typescript'
import type { TianGan, WuXing, BirthInfo, BaziResult, TenGod } from '../../../types'
import { getAge } from '../../../utils/date'
import { GAN_WUXING, WU_XING_SHENG, WU_XING_KE } from '../../../utils/wuxing'
import { FORTUNE_TEN_GOD, FORTUNE_LEVEL_TEXT, FORTUNE_KEY_REASON } from '../../../locales/zh-CN'

export interface YearFortune {
  year: number
  ganZhi: string
  tianGan: TianGan
  diZhi: string
  tenGod: TenGod
  wuXing: WuXing
  score: number
  level: '大吉' | '吉' | '平' | '凶' | '大凶'
  tags: string[]
  summary: string
  career: string
  wealth: string
  love: string
  health: string
  isKeyYear: boolean
  keyReason?: string
}

export interface FortuneResult {
  birthInfo: BirthInfo
  baziResult: BaziResult
  fortunes: YearFortune[]
  overallTrend: '上升' | '平稳' | '波动' | '下降'
  bestYear: number
  worstYear: number
  keyYears: number[]
}

const LEVEL_RANGES: { min: number; max: number; level: YearFortune['level'] }[] = [
  { min: 80, max: 100, level: '大吉' },
  { min: 65, max: 79, level: '吉' },
  { min: 45, max: 64, level: '平' },
  { min: 30, max: 44, level: '凶' },
  { min: 0, max: 29, level: '大凶' },
]

function getLevel(score: number): YearFortune['level'] {
  for (const r of LEVEL_RANGES) {
    if (score >= r.min && score <= r.max) return r.level
  }
  return '平'
}

function getTenGod(dayGan: TianGan, targetGan: TianGan): TenGod {
  if (dayGan === targetGan) return '日主'

  const dayWx = GAN_WUXING[dayGan]
  const targetWx = GAN_WUXING[targetGan]
  const isSameWx = dayWx === targetWx

  const dayYang = '甲丙戊庚壬'.includes(dayGan)
  const targetYang = '甲丙戊庚壬'.includes(targetGan)
  const isSameYinYang = dayYang === targetYang

  if (WU_XING_SHENG[dayWx] === targetWx) {
    return isSameYinYang ? '食神' : '伤官'
  }
  if (WU_XING_KE[dayWx] === targetWx) {
    return isSameYinYang ? '偏财' : '正财'
  }
  if (WU_XING_SHENG[targetWx] === dayWx) {
    return isSameYinYang ? '偏印' : '正印'
  }
  if (WU_XING_KE[targetWx] === dayWx) {
    return isSameYinYang ? '七杀' : '正官'
  }
  if (isSameWx) {
    return isSameYinYang ? '比肩' : '劫财'
  }

  return '日主'
}

function calculateScore(
  dayGan: TianGan,
  yearGan: TianGan,
  xiYongShen?: BaziResult['xiYongShen'],
  dayunGanZhi?: string
): number {
  const tenGod = getTenGod(dayGan, yearGan)
  let baseScore = FORTUNE_TEN_GOD[tenGod]?.score ?? 50

  if (xiYongShen) {
    const yearWx = GAN_WUXING[yearGan]
    if (yearWx === xiYongShen.yongShen) baseScore += 15
    else if (xiYongShen.xiShen.includes(yearWx)) baseScore += 8
    else if (yearWx === xiYongShen.jiShen[0] || yearWx === xiYongShen.jiShen[1]) baseScore -= 10
  }

  if (dayunGanZhi) {
    const dayunGan = dayunGanZhi[0] as TianGan
    const dayunWx = GAN_WUXING[dayunGan]
    if (xiYongShen) {
      if (dayunWx === xiYongShen.yongShen) baseScore += 5
      else if (xiYongShen.xiShen.includes(dayunWx)) baseScore += 3
    }
  }

  return Math.max(0, Math.min(100, baseScore))
}

function generateFortuneDetail(
  tenGod: TenGod,
  level: YearFortune['level']
): Omit<YearFortune, 'year' | 'ganZhi' | 'tianGan' | 'diZhi' | 'wuXing' | 'score' | 'level' | 'isKeyYear' | 'keyReason'> {
  const base = FORTUNE_TEN_GOD[tenGod] ?? { tags: ['未知'], desc: '运势待察' }
  const levelText = FORTUNE_LEVEL_TEXT[level]

  return {
    tenGod,
    tags: [...base.tags],
    summary: base.desc,
    career: levelText.career,
    wealth: levelText.wealth,
    love: levelText.love,
    health: levelText.health,
  }
}

export function calculateFortune(birthInfo: BirthInfo, baziResult: BaziResult): FortuneResult | null {
  if (!birthInfo.date) return null

  const currentYear = new Date().getFullYear()
  const dayGan = baziResult.dayMaster
  const fortunes: YearFortune[] = []

  for (let i = 0; i < 10; i++) {
    const year = currentYear + i
    const solar = Solar.fromYmd(year, 1, 1)
    const lunar = solar.getLunar()
    const eightChar = lunar.getEightChar()

    const yearGan = eightChar.getYearGan() as TianGan
    const yearZhi = eightChar.getYearZhi()
    const ganZhi = yearGan + yearZhi
    const tenGod = getTenGod(dayGan, yearGan)

    const age = getAge(new Date(birthInfo.date))
    const currentDayun = baziResult.dayun.find(
      d => age >= d.startAge && age <= d.endAge
    )
    const dayunGanZhi = currentDayun
      ? currentDayun.tianGan + currentDayun.diZhi
      : undefined

    const score = calculateScore(dayGan, yearGan, baziResult.xiYongShen, dayunGanZhi)
    const level = getLevel(score)
    const detail = generateFortuneDetail(tenGod, level)

    const isKeyYear = score >= 80 || score <= 35 || i === 0
    let keyReason: string | undefined
    if (score >= 80) keyReason = FORTUNE_KEY_REASON.best
    else if (score <= 35) keyReason = FORTUNE_KEY_REASON.worst
    else if (i === 0) keyReason = FORTUNE_KEY_REASON.current

    fortunes.push({
      year,
      ganZhi,
      tianGan: yearGan,
      diZhi: yearZhi,
      wuXing: GAN_WUXING[yearGan],
      score,
      level,
      isKeyYear,
      keyReason,
      ...detail,
    })
  }

  const scores = fortunes.map(f => f.score)
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const bestYear = fortunes.reduce((a, b) => a.score > b.score ? a : b).year
  const worstYear = fortunes.reduce((a, b) => a.score < b.score ? a : b).year
  const keyYears = fortunes.filter(f => f.isKeyYear).map(f => f.year)

  const firstHalf = scores.slice(0, 5).reduce((a, b) => a + b, 0) / 5
  const secondHalf = scores.slice(5).reduce((a, b) => a + b, 0) / 5

  let overallTrend: FortuneResult['overallTrend']
  if (secondHalf - firstHalf > 10) overallTrend = '上升'
  else if (firstHalf - secondHalf > 10) overallTrend = '下降'
  else if (Math.max(...scores) - Math.min(...scores) > 30) overallTrend = '波动'
  else overallTrend = '平稳'

  return {
    birthInfo,
    baziResult,
    fortunes,
    overallTrend,
    bestYear,
    worstYear,
    keyYears,
  }
}
