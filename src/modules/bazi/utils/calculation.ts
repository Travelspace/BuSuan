import { Solar, Lunar, EightChar } from 'lunar-typescript'
import type { 
  BaziResult, 
  Pillar, 
  HiddenStem, 
  TenGodRelation, 
  Dayun, 
  Liunian,
  WuXing,
  TianGan,
  DiZhi,
  Gender,
  CalendarType,
  BirthInfo
} from '../../../types'

const HIDE_GAN_TYPE: Record<number, ('本气' | '中气' | '余气')[]> = {
  0: ['本气'],
  1: ['本气', '中气'],
  2: ['本气', '中气', '余气'],
}

const GAN_WUXING: Record<string, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
}

const ZHI_WUXING: Record<string, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

const WUXING_COUNT_MAP: Record<WuXing, number> = {
  '金': 0, '木': 0, '水': 0, '火': 0, '土': 0,
}

function getTimeIndex(hour: number, minute: number): number {
  if (hour === 0 && minute === 0) return 0
  if (hour === 23 && minute >= 30) return 12
  return Math.floor((hour + 1) / 2)
}

function getGenderNum(gender: Gender): number {
  return gender === 'male' ? 1 : 0
}

function countFiveElements(eightChar: EightChar): Record<WuXing, number> {
  const counts = { ...WUXING_COUNT_MAP }
  
  const gans = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()]
  const zhis = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()]
  
  gans.forEach(gan => {
    const wx = GAN_WUXING[gan]
    if (wx) counts[wx] += 1
  })
  
  zhis.forEach(zhi => {
    const wx = ZHI_WUXING[zhi]
    if (wx) counts[wx] += 1
  })
  
  const hideGans = [
    eightChar.getYearHideGan(),
    eightChar.getMonthHideGan(),
    eightChar.getDayHideGan(),
    eightChar.getTimeHideGan(),
  ]
  
  hideGans.forEach(hgList => {
    hgList.forEach(gan => {
      const wx = GAN_WUXING[gan]
      if (wx) counts[wx] += 0.5
    })
  })
  
  return counts
}

function getHiddenStems(hideGans: string[]): HiddenStem[] {
  const types = HIDE_GAN_TYPE[Math.min(hideGans.length - 1, 2)] || ['本气']
  return hideGans.map((gan, i) => ({
    tianGan: gan as TianGan,
    type: types[i] || '余气',
    strength: hideGans.length === 1 ? 1 : (i === 0 ? 0.6 : i === 1 ? 0.3 : 0.1),
  }))
}

function getXiYongShen(eightChar: EightChar, fiveElements: Record<WuXing, number>): BaziResult['xiYongShen'] {
  const dayGan = eightChar.getDayGan()
  const dayWx = GAN_WUXING[dayGan]
  
  const shengMap: Record<WuXing, WuXing> = { '金': '土', '木': '水', '水': '金', '火': '木', '土': '火' }
  const keMap: Record<WuXing, WuXing> = { '金': '火', '木': '金', '水': '土', '火': '水', '土': '木' }
  
  const sorted = (Object.entries(fiveElements) as [WuXing, number][])
    .sort((a, b) => b[1] - a[1])
  
  const isStrong = fiveElements[dayWx] >= 3 || fiveElements[shengMap[dayWx]] >= 2
  
  let yongShen: WuXing
  let xiShen: WuXing[]
  let jiShen: WuXing[]
  
  if (isStrong) {
    yongShen = keMap[dayWx]
    xiShen = [shengMap[keMap[dayWx]], keMap[dayWx]]
    jiShen = [dayWx, shengMap[dayWx]]
  } else {
    yongShen = shengMap[dayWx]
    xiShen = [dayWx, shengMap[dayWx]]
    jiShen = [keMap[dayWx], keMap[shengMap[dayWx]]]
  }
  
  return { yongShen, xiShen, jiShen }
}

export function calculateBazi(birthInfo: BirthInfo): BaziResult | null {
  if (!birthInfo.date) return null
  
  const date = new Date(birthInfo.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const timeIndex = getTimeIndex(hour, minute)
  
  let lunar: Lunar
  
  if (birthInfo.calendar === 'solar') {
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
  } else {
    lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0)
  }
  
  const eightChar = lunar.getEightChar()
  
  const pillars = {
    year: {
      tianGan: eightChar.getYearGan() as TianGan,
      diZhi: eightChar.getYearZhi() as DiZhi,
      nayin: eightChar.getYearNaYin(),
    } as Pillar,
    month: {
      tianGan: eightChar.getMonthGan() as TianGan,
      diZhi: eightChar.getMonthZhi() as DiZhi,
      nayin: eightChar.getMonthNaYin(),
    } as Pillar,
    day: {
      tianGan: eightChar.getDayGan() as TianGan,
      diZhi: eightChar.getDayZhi() as DiZhi,
      nayin: eightChar.getDayNaYin(),
    } as Pillar,
    hour: {
      tianGan: eightChar.getTimeGan() as TianGan,
      diZhi: eightChar.getTimeZhi() as DiZhi,
      nayin: eightChar.getTimeNaYin(),
    } as Pillar,
  }
  
  const tenGods: TenGodRelation[] = [
    { position: '年干', tianGan: eightChar.getYearGan() as TianGan, tenGod: eightChar.getYearShiShenGan() as any },
    { position: '月干', tianGan: eightChar.getMonthGan() as TianGan, tenGod: eightChar.getMonthShiShenGan() as any },
    { position: '日干', tianGan: eightChar.getDayGan() as TianGan, tenGod: '日主' as any },
    { position: '时干', tianGan: eightChar.getTimeGan() as TianGan, tenGod: eightChar.getTimeShiShenGan() as any },
  ]
  
  const fiveElements = countFiveElements(eightChar)
  
  const nayin = {
    year: eightChar.getYearNaYin(),
    month: eightChar.getMonthNaYin(),
    day: eightChar.getDayNaYin(),
    hour: eightChar.getTimeNaYin(),
  }
  
  const hiddenStems = {
    year: getHiddenStems(eightChar.getYearHideGan()),
    month: getHiddenStems(eightChar.getMonthHideGan()),
    day: getHiddenStems(eightChar.getDayHideGan()),
    hour: getHiddenStems(eightChar.getTimeHideGan()),
  }
  
  const genderNum = getGenderNum(birthInfo.gender)
  const yun = eightChar.getYun(genderNum, 1)
  const daYunList = yun.getDaYun()
  
  const dayun: Dayun[] = daYunList.slice(1, 11).map((dy) => ({
    startAge: dy.getStartAge(),
    endAge: dy.getEndAge(),
    tianGan: dy.getGanZhi()[0] as TianGan,
    diZhi: dy.getGanZhi()[1] as DiZhi,
    tenGod: '' as any,
  }))
  
  const currentYear = new Date().getFullYear()
  const liunian: Liunian[] = []
  for (let i = 0; i < 10; i++) {
    const y = currentYear + i
    const solar = Solar.fromYmd(y, 1, 1)
    const l = solar.getLunar()
    const ec = l.getEightChar()
    liunian.push({
      year: y,
      tianGan: ec.getYearGan() as TianGan,
      diZhi: ec.getYearZhi() as DiZhi,
      tenGod: ec.getYearShiShenGan() as any,
    })
  }
  
  const xiYongShen = getXiYongShen(eightChar, fiveElements)
  
  return {
    pillars,
    dayMaster: eightChar.getDayGan() as TianGan,
    tenGods,
    fiveElements,
    nayin,
    hiddenStems,
    dayun,
    liunian,
    xiYongShen,
  }
}

export function solarToLunar(year: number, month: number, day: number): string {
  const solar = Solar.fromYmd(year, month, day)
  const lunar = solar.getLunar()
  return lunar.toString()
}

export function lunarToSolar(year: number, month: number, day: number): string {
  const lunar = Lunar.fromYmd(year, month, day)
  const solar = lunar.getSolar()
  return solar.toString()
}

export function getShengXiao(year: number): string {
  const solar = Solar.fromYmd(year, 1, 1)
  const lunar = solar.getLunar()
  return lunar.getShengxiao()
}

export function getXingZuo(month: number, day: number): string {
  const solar = Solar.fromYmd(2000, month, day)
  return solar.getXingZuo()
}

export function getJieQi(year: number, month: number, day: number): string {
  const solar = Solar.fromYmd(year, month, day)
  const lunar = solar.getLunar()
  const jieQi = lunar.getJieQi()
  return jieQi || ''
}

export function dateToBazi(dateStr: string, calendar: 'solar' | 'lunar' = 'solar'): string {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  
  let lunar: Lunar
  
  if (calendar === 'solar') {
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
  } else {
    lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0)
  }
  
  const eightChar = lunar.getEightChar()
  
  const yearGan = eightChar.getYearGan()
  const yearZhi = eightChar.getYearZhi()
  const monthGan = eightChar.getMonthGan()
  const monthZhi = eightChar.getMonthZhi()
  const dayGan = eightChar.getDayGan()
  const dayZhi = eightChar.getDayZhi()
  const hourGan = eightChar.getTimeGan()
  const hourZhi = eightChar.getTimeZhi()
  
  return `${yearGan}${yearZhi}年 ${monthGan}${monthZhi}月 ${dayGan}${dayZhi}日 ${hourGan}${hourZhi}时`
}
