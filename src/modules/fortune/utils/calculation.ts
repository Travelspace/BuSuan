import { Solar } from 'lunar-typescript'
import type { WuXing, TianGan, BirthInfo, BaziResult } from '../../../types'

const GAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
}

const ZHI_WUXING: Record<string, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

export interface YearFortune {
  year: number
  ganZhi: string
  tianGan: TianGan
  diZhi: string
  tenGod: string
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

const SHENG_MAP: Record<WuXing, WuXing> = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
}

const KE_MAP: Record<WuXing, WuXing> = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
}

const TEN_GOD_FORTUNE: Record<string, { score: number; tags: string[]; desc: string }> = {
  '比肩': { score: 60, tags: ['竞争', '合作'], desc: '比肩助力，竞争与合作并存' },
  '劫财': { score: 45, tags: ['破财', '争夺'], desc: '劫财当值，需防破财争夺' },
  '食神': { score: 80, tags: ['才艺', '口福'], desc: '食神生财，才艺得展' },
  '伤官': { score: 50, tags: ['创新', '是非'], desc: '伤官见官，创新与是非并存' },
  '正财': { score: 85, tags: ['稳定', '收入'], desc: '正财入命，收入稳定增长' },
  '偏财': { score: 70, tags: ['横财', '投资'], desc: '偏财降临，投资需谨慎' },
  '正官': { score: 75, tags: ['升迁', '名誉'], desc: '正官护身，事业有望升迁' },
  '七杀': { score: 40, tags: ['压力', '突破'], desc: '七杀压身，压力中求突破' },
  '正印': { score: 80, tags: ['学业', '贵人'], desc: '正印护佑，学业有贵人助' },
  '偏印': { score: 55, tags: ['偏门', '孤独'], desc: '偏印当值，偏门技艺可得' },
  '日主': { score: 65, tags: ['自我', '根基'], desc: '日主当值，自我意识增强' },
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

function getTenGod(dayGan: TianGan, targetGan: TianGan): string {
  if (dayGan === targetGan) return '日主'

  const dayWx = GAN_WUXING[dayGan]
  const targetWx = GAN_WUXING[targetGan]
  const isSameWx = dayWx === targetWx

  const dayYang = '甲丙戊庚壬'.includes(dayGan)
  const targetYang = '甲丙戊庚壬'.includes(targetGan)
  const isSameYinYang = dayYang === targetYang

  if (SHENG_MAP[dayWx] === targetWx) {
    return isSameYinYang ? '食神' : '伤官'
  }
  if (KE_MAP[dayWx] === targetWx) {
    return isSameYinYang ? '偏财' : '正财'
  }
  if (SHENG_MAP[targetWx] === dayWx) {
    return isSameYinYang ? '偏印' : '正印'
  }
  if (KE_MAP[targetWx] === dayWx) {
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
  let baseScore = TEN_GOD_FORTUNE[tenGod]?.score || 50

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
  tenGod: string,
  score: number,
  level: YearFortune['level']
): Omit<YearFortune, 'year' | 'ganZhi' | 'tianGan' | 'diZhi' | 'wuXing' | 'score' | 'level' | 'isKeyYear' | 'keyReason'> {
  const base = TEN_GOD_FORTUNE[tenGod] || { tags: ['未知'], desc: '运势待察' }

  const careerMap: Record<string, string> = {
    '大吉': '事业大顺，贵人相助，宜大展宏图',
    '吉': '事业顺遂，稳步上升，可适度进取',
    '平': '事业平稳，按部就班，不宜冒进',
    '凶': '事业受阻，需防小人，谨慎行事',
    '大凶': '事业多艰，宜守不宜攻，韬光养晦',
  }

  const wealthMap: Record<string, string> = {
    '大吉': '财运亨通，正偏财皆旺，可适度投资',
    '吉': '财运不错，正财为主，量入为出',
    '平': '财运平稳，收支平衡，不宜投机',
    '凶': '财运欠佳，需防破财，减少开支',
    '大凶': '财运低迷，切忌投资，守住本金',
  }

  const loveMap: Record<string, string> = {
    '大吉': '感情甜蜜，单身有望脱单，已婚和谐',
    '吉': '感情融洽，多沟通增进理解',
    '平': '感情平淡，需用心经营',
    '凶': '感情波折，需防口角误会',
    '大凶': '感情危机，冷静处理，避免冲动',
  }

  const healthMap: Record<string, string> = {
    '大吉': '身体健康，精力充沛，宜适度运动',
    '吉': '健康状况良好，注意作息规律',
    '平': '健康一般，注意饮食与休息',
    '凶': '健康欠佳，注意体检与调养',
    '大凶': '健康需警惕，及时就医检查',
  }

  return {
    tenGod,
    tags: base.tags,
    summary: base.desc,
    career: careerMap[level],
    wealth: wealthMap[level],
    love: loveMap[level],
    health: healthMap[level],
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

    const currentDayun = baziResult.dayun.find(
      d => {
        const age = year - new Date(birthInfo.date).getFullYear()
        return age >= d.startAge && age <= d.endAge
      }
    )
    const dayunGanZhi = currentDayun
      ? currentDayun.tianGan + currentDayun.diZhi
      : undefined

    const score = calculateScore(dayGan, yearGan, baziResult.xiYongShen, dayunGanZhi)
    const level = getLevel(score)
    const detail = generateFortuneDetail(tenGod, score, level)

    const isKeyYear = score >= 80 || score <= 35 || i === 0
    let keyReason: string | undefined
    if (score >= 80) keyReason = '运势极佳，把握机遇'
    else if (score <= 35) keyReason = '运势低迷，谨慎行事'
    else if (i === 0) keyReason = '当前年份'

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
