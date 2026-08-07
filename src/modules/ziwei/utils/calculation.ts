import { astro } from 'iztro'
import type { BirthInfo } from '../../../types'
import { getTimeIndex } from '../../../utils/date'

export interface IztroStar {
  name: string
  mutagen?: string
}

export interface IztroPalace {
  index: number
  name: string
  heavenlyStem: string
  earthlyBranch: string
  majorStars: IztroStar[]
  minorStars: IztroStar[]
  adjectiveStars?: IztroStar[]
  isBodyPalace: boolean
  decadal?: {
    range: [number, number]
    heavenlyStem: string
    earthlyBranch: string
  }
  ages?: number[]
}

export interface IztroAstrolabe {
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
  palaces: IztroPalace[]
  horoscope: (dateStr: string, timeIndex: number) => unknown
}

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
  astrolabe: IztroAstrolabe
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
    const astrolabe = (birthInfo.calendar === 'solar'
      ? astro.bySolar(dateStr, timeIndex, genderStr, true, 'zh-CN')
      : astro.byLunar(dateStr, timeIndex, genderStr, false, true, 'zh-CN')) as IztroAstrolabe

    const palaces: ZiweiPalaceData[] = astrolabe.palaces.map((p: IztroPalace) => ({
      index: p.index,
      name: p.name.endsWith('宫') ? p.name : p.name + '宫',
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: p.majorStars.map((s: IztroStar) => s.name),
      minorStars: p.minorStars.map((s: IztroStar) => s.name),
      adjectiveStars: p.adjectiveStars?.map((s: IztroStar) => s.name) || [],
      sihua: p.majorStars
        .filter((s: IztroStar) => s.mutagen)
        .map((s: IztroStar) => `${s.name}·${s.mutagen}`)
        .concat(
          p.minorStars
            .filter((s: IztroStar) => s.mutagen)
            .map((s: IztroStar) => `${s.name}·${s.mutagen}`)
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

    astrolabe.palaces.forEach((p: IztroPalace) => {
      const allStars = [...p.majorStars, ...p.minorStars]
      allStars.forEach((s: IztroStar) => {
        if (s.mutagen && mutagenMap[s.mutagen]) {
          const key = mutagenMap[s.mutagen]
          sihua[key] = { star: s.name, palace: p.index }
        }
      })
    })

    const mingGong = astrolabe.palaces.find((p: IztroPalace) => p.name === '命宫' || p.name === '命')
    const mingGongStars = mingGong
      ? mingGong.majorStars.map((s: IztroStar) => s.name)
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

export function getHoroscope(astrolabe: IztroAstrolabe | null, dateStr: string, timeIndex: number) {
  if (!astrolabe) return null
  try {
    return astrolabe.horoscope(dateStr, timeIndex)
  } catch {
    return null
  }
}
