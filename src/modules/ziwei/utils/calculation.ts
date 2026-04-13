import { astro } from 'iztro'
import type { BirthInfo } from '../../../types'

export interface ZiweiPalaceData {
  index: number
  name: string
  heavenlyStem: string
  earthlyBranch: string
  majorStars: string[]
  minorStars: string[]
  adjectiveStars: string[]
  sihua: string[]
  isBodyPalace: boolean
  decadal: {
    range: [number, number]
    heavenlyStem: string
    earthlyBranch: string
  }
  ages: number[]
}

export interface ZiweiCalcResult {
  gender: string
  solarDate: string
  lunarDate: string
  chineseDate: string
  time: string
  timeRange: string
  sign: string
  zodiac: string
  fiveElementsClass: string
  soul: string
  body: string
  earthlyBranchOfSoulPalace: string
  earthlyBranchOfBodyPalace: string
  palaces: ZiweiPalaceData[]
  sihua: {
    lu: { star: string; palace: number }
    quan: { star: string; palace: number }
    ke: { star: string; palace: number }
    ji: { star: string; palace: number }
  }
  mingGongStars: string[]
  astrolabe: any
}

function getTimeIndex(hour: number, minute: number): number {
  if (hour === 0 && minute === 0) return 0
  if (hour === 23 && minute >= 30) return 12
  return Math.floor((hour + 1) / 2)
}

export function calculateZiwei(birthInfo: BirthInfo): ZiweiCalcResult | null {
  if (!birthInfo.date) return null

  const date = new Date(birthInfo.date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const timeIndex = getTimeIndex(hour, minute)

  const genderStr = birthInfo.gender === 'male' ? '男' : '女'
  const dateStr = `${year}-${month}-${day}`

  try {
    const astrolabe = birthInfo.calendar === 'solar'
      ? astro.bySolar(dateStr, timeIndex, genderStr, true, 'zh-CN')
      : astro.byLunar(dateStr, timeIndex, genderStr, false, true, 'zh-CN')

    const palaces: ZiweiPalaceData[] = astrolabe.palaces.map((p: any) => ({
      index: p.index,
      name: p.name.endsWith('宫') ? p.name : p.name + '宫',
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: p.majorStars.map((s: any) => s.name),
      minorStars: p.minorStars.map((s: any) => s.name),
      adjectiveStars: p.adjectiveStars?.map((s: any) => s.name) || [],
      sihua: p.majorStars
        .filter((s: any) => s.mutagen)
        .map((s: any) => `${s.name}·${s.mutagen}`)
        .concat(
          p.minorStars
            .filter((s: any) => s.mutagen)
            .map((s: any) => `${s.name}·${s.mutagen}`)
        ),
      isBodyPalace: p.isBodyPalace,
      decadal: p.decadal
        ? {
            range: p.decadal.range,
            heavenlyStem: p.decadal.heavenlyStem,
            earthlyBranch: p.decadal.earthlyBranch,
          }
        : { range: [0, 0] as [number, number], heavenlyStem: '', earthlyBranch: '' },
      ages: p.ages || [],
    }))

    const sihua = {
      lu: { star: '', palace: -1 },
      quan: { star: '', palace: -1 },
      ke: { star: '', palace: -1 },
      ji: { star: '', palace: -1 },
    }

    const mutagenMap: Record<string, 'lu' | 'quan' | 'ke' | 'ji'> = {
      '禄': 'lu', '权': 'quan', '科': 'ke', '忌': 'ji',
    }

    astrolabe.palaces.forEach((p: any) => {
      const allStars = [...p.majorStars, ...p.minorStars]
      allStars.forEach((s: any) => {
        if (s.mutagen && mutagenMap[s.mutagen]) {
          const key = mutagenMap[s.mutagen]
          sihua[key] = { star: s.name, palace: p.index }
        }
      })
    })

    const mingGong = astrolabe.palaces.find((p: any) => p.name === '命宫' || p.name === '命')
    const mingGongStars = mingGong
      ? mingGong.majorStars.map((s: any) => s.name)
      : []

    return {
      gender: astrolabe.gender,
      solarDate: astrolabe.solarDate,
      lunarDate: astrolabe.lunarDate,
      chineseDate: astrolabe.chineseDate,
      time: astrolabe.time,
      timeRange: astrolabe.timeRange,
      sign: astrolabe.sign,
      zodiac: astrolabe.zodiac,
      fiveElementsClass: astrolabe.fiveElementsClass,
      soul: astrolabe.soul,
      body: astrolabe.body,
      earthlyBranchOfSoulPalace: astrolabe.earthlyBranchOfSoulPalace,
      earthlyBranchOfBodyPalace: astrolabe.earthlyBranchOfBodyPalace,
      palaces,
      sihua,
      mingGongStars,
      astrolabe,
    }
  } catch (e) {
    console.error('紫微斗数排盘失败:', e)
    return null
  }
}

export function getHoroscope(astrolabe: any, dateStr: string, timeIndex: number) {
  if (!astrolabe) return null
  try {
    return astrolabe.horoscope(dateStr, timeIndex)
  } catch {
    return null
  }
}
