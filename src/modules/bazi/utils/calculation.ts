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
  BirthInfo
} from '../../../types'
import { GAN_WUXING, ZHI_WUXING, getShengWo, getKeWo, getTenGodByGan } from '../../../utils/wuxing'
import { getCorrectedSolarTime } from '../../../utils/trueSolarTime'

const HIDE_GAN_TYPE: Record<number, ('本气' | '中气' | '余气')[]> = {
  0: ['本气'],
  1: ['本气', '中气'],
  2: ['本气', '中气', '余气'],
}

const WUXING_COUNT_MAP: Record<WuXing, number> = {
  '金': 0, '木': 0, '水': 0, '火': 0, '土': 0,
}

function getGenderNum(gender: Gender): number {
  return gender === 'male' ? 1 : 0
}

function countFiveElements(eightChar: EightChar): Record<WuXing, number> {
  const counts = { ...WUXING_COUNT_MAP }
  
  const gans = [eightChar.getYearGan(), eightChar.getMonthGan(), eightChar.getDayGan(), eightChar.getTimeGan()]
  const zhis = [eightChar.getYearZhi(), eightChar.getMonthZhi(), eightChar.getDayZhi(), eightChar.getTimeZhi()]
  
  gans.forEach(gan => {
    const wx = GAN_WUXING[gan as TianGan]
    if (wx) counts[wx] += 1
  })
  
  zhis.forEach(zhi => {
    const wx = ZHI_WUXING[zhi as DiZhi]
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
      const wx = GAN_WUXING[gan as TianGan]
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
  const dayGan = eightChar.getDayGan() as TianGan
  const dayWx = GAN_WUXING[dayGan]
  
  const motherWx = getShengWo(dayWx)
  const keDayWx = getKeWo(dayWx)
  
  const isStrong = fiveElements[dayWx] >= 3 || fiveElements[motherWx] >= 2
  
  let yongShen: WuXing
  let xiShen: WuXing[]
  let jiShen: WuXing[]
  
  if (isStrong) {
    yongShen = keDayWx
    xiShen = [getShengWo(keDayWx), keDayWx]
    jiShen = [dayWx, motherWx]
  } else {
    yongShen = motherWx
    xiShen = [dayWx, motherWx]
    jiShen = [keDayWx, getKeWo(motherWx)]
  }
  
  return { yongShen, xiShen, jiShen }
}

export function calculateBazi(birthInfo: BirthInfo): BaziResult | null {
  if (!birthInfo.date) return null

  // 真太阳时校正: 若有经度和时区, 自动校正出生时间
  const corrected = getCorrectedSolarTime(
    birthInfo.date, birthInfo.calendar,
    birthInfo.longitude, birthInfo.timezone,
  )
  const { year, month, day, hour, minute } = corrected
  let lunar: Lunar

  if (birthInfo.calendar === 'solar') {
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
  } else {
    // 农历输入: corrected 已将农历转为阳历, 直接用阳历创建
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
    lunar = solar.getLunar()
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
  
  const dayGan = eightChar.getDayGan() as TianGan

  const tenGods: TenGodRelation[] = [
    { position: '年干', tianGan: eightChar.getYearGan() as TianGan, tenGod: getTenGodByGan(dayGan, eightChar.getYearGan() as TianGan) },
    { position: '月干', tianGan: eightChar.getMonthGan() as TianGan, tenGod: getTenGodByGan(dayGan, eightChar.getMonthGan() as TianGan) },
    { position: '日干', tianGan: dayGan, tenGod: '日主' },
    { position: '时干', tianGan: eightChar.getTimeGan() as TianGan, tenGod: getTenGodByGan(dayGan, eightChar.getTimeGan() as TianGan) },
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
    tenGod: getTenGodByGan(dayGan, dy.getGanZhi()[0] as TianGan),
  }))
  
  const currentYear = new Date().getFullYear()
  const liunian: Liunian[] = []
  for (let i = 0; i < 10; i++) {
    const y = currentYear + i
    const solar = Solar.fromYmd(y, 1, 1)
    const l = solar.getLunar()
    const ec = l.getEightChar()
    const liunianGan = ec.getYearGan() as TianGan
    liunian.push({
      year: y,
      tianGan: liunianGan,
      diZhi: ec.getYearZhi() as DiZhi,
      tenGod: getTenGodByGan(dayGan, liunianGan),
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

