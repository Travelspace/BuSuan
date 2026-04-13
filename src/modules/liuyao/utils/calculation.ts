import type { LiuyaoResult, GuaInfo, YaoInfo } from '../../../types'
import { TRIGRAM_DATA, getGuaKey, getGuaByKey, type GuaData } from '../data/guaData'
import { TRIGRAM_WUXING } from './constants'

const SHENG_MAP: Record<string, string> = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
const KE_MAP: Record<string, string> = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }

function getWuXingRelation(from: string, to: string): '生' | '克' | '比和' | '被生' | '被克' {
  if (from === to) return '比和'
  if (SHENG_MAP[from] === to) return '生'
  if (KE_MAP[from] === to) return '克'
  if (SHENG_MAP[to] === from) return '被生'
  if (KE_MAP[to] === from) return '被克'
  return '比和'
}

function yaosToGuaInfo(yaos: YaoInfo[], guaData: GuaData | undefined): GuaInfo {
  const lowerYao = yaos.slice(0, 3).map(y => y.type === '阳' ? 1 : 0)
  const upperYao = yaos.slice(3, 6).map(y => y.type === '阳' ? 1 : 0)

  const lowerKey = lowerYao.join('').replace(/0/g, '0').replace(/1/g, '1')
  const upperKey = upperYao.join('').replace(/0/g, '0').replace(/1/g, '1')

  const lowerTri = TRIGRAM_DATA[lowerKey]
  const upperTri = TRIGRAM_DATA[upperKey]

  if (guaData) {
    return {
      name: guaData.name,
      fullName: guaData.fullName,
      symbol: guaData.symbol,
      upperTrigram: guaData.upperTrigram,
      lowerTrigram: guaData.lowerTrigram,
      wuxing: guaData.wuxing,
      guaci: guaData.guaci,
      guaciExplain: guaData.guaciExplain,
      yaoci: guaData.yaoci.map((y, i) => ({
        position: y.position,
        type: yaos[i]?.type || '阳',
        isMoving: yaos[i]?.isMoving || false,
        text: y.text,
        explain: y.explain,
      })),
    }
  }

  const name = (lowerTri?.name || '?') + (upperTri?.name || '?')
  return {
    name,
    fullName: name + '卦',
    symbol: (upperTri?.symbol || '') + (lowerTri?.symbol || ''),
    upperTrigram: upperTri?.name || '',
    lowerTrigram: lowerTri?.name || '',
    wuxing: TRIGRAM_WUXING[upperTri?.name || ''] || '土',
    guaci: '卦辞待补充',
    guaciExplain: '此卦辞待补充完善',
    yaoci: yaos.map(y => ({
      position: y.position,
      type: y.type,
      isMoving: y.isMoving,
      text: `${y.position === 1 ? '初' : y.position === 6 ? '上' : y.position}${y.type === '阳' ? '九' : '六'}：爻辞待补充`,
      explain: '爻辞解释待补充',
    })),
  }
}

function getHuGua(yaos: YaoInfo[]): GuaInfo | null {
  if (yaos.length < 5) return null

  const huYaos: YaoInfo[] = [
    { ...yaos[1], position: 1, isMoving: false },
    { ...yaos[2], position: 2, isMoving: false },
    { ...yaos[3], position: 3, isMoving: false },
    { ...yaos[2], position: 4, isMoving: false },
    { ...yaos[3], position: 5, isMoving: false },
    { ...yaos[4], position: 6, isMoving: false },
  ]

  const huKey = getGuaKey(huYaos.map(y => y.type === '阳' ? 1 : 0) as [number, number, number, number, number, number])
  const huData = getGuaByKey(huKey)

  return yaosToGuaInfo(huYaos, huData)
}

function getBianGua(yaos: YaoInfo[]): GuaInfo | null {
  const hasMoving = yaos.some(y => y.isMoving)
  if (!hasMoving) return null

  const bianYaos: YaoInfo[] = yaos.map(y => ({
    ...y,
    type: y.isMoving ? (y.type === '阳' ? '阴' : '阳') : y.type,
    isMoving: false,
  }))

  const bianKey = getGuaKey(bianYaos.map(y => y.type === '阳' ? 1 : 0) as [number, number, number, number, number, number])
  const bianData = getGuaByKey(bianKey)

  return yaosToGuaInfo(bianYaos, bianData)
}

function analyzeTiYong(benGua: GuaInfo, dongYao: number[]): LiuyaoResult['tiYong'] {
  const hasMoving = dongYao.length > 0

  let tiGuaName: string
  let yongGuaName: string

  if (!hasMoving) {
    tiGuaName = benGua.lowerTrigram
    yongGuaName = benGua.upperTrigram
  } else {
    const lowerMoving = dongYao.some(d => d <= 3)
    const upperMoving = dongYao.some(d => d > 3)

    if (lowerMoving && !upperMoving) {
      tiGuaName = benGua.upperTrigram
      yongGuaName = benGua.lowerTrigram
    } else if (upperMoving && !lowerMoving) {
      tiGuaName = benGua.lowerTrigram
      yongGuaName = benGua.upperTrigram
    } else {
      tiGuaName = benGua.lowerTrigram
      yongGuaName = benGua.upperTrigram
    }
  }

  const tiWx = TRIGRAM_WUXING[tiGuaName] || '土'
  const yongWx = TRIGRAM_WUXING[yongGuaName] || '土'
  const relation = getWuXingRelation(tiWx, yongWx)

  let isGood = false
  if (relation === '比和' || relation === '被生') {
    isGood = true
  } else if (relation === '生') {
    isGood = true
  } else if (relation === '克') {
    isGood = true
  } else {
    isGood = false
  }

  return {
    tiGua: tiGuaName,
    yongGua: yongGuaName,
    relation,
    isGood,
  }
}

function getInterpretation(
  benGua: GuaInfo,
  tiYong: LiuyaoResult['tiYong'],
  dongYao: number[]
): LiuyaoResult['interpretation'] {
  let summary = `本卦${benGua.fullName}，`
  summary += `体卦为${tiYong.tiGua}（${TRIGRAM_WUXING[tiYong.tiGua]}），`
  summary += `用卦为${tiYong.yongGua}（${TRIGRAM_WUXING[tiYong.yongGua]}），`

  if (tiYong.relation === '比和') {
    summary += '体用比和，万事顺遂。'
  } else if (tiYong.relation === '被生') {
    summary += '用生体，有贵人相助，事情易成。'
  } else if (tiYong.relation === '生') {
    summary += '体生用，泄气之象，需费力方可成功。'
  } else if (tiYong.relation === '克') {
    summary += '体克用，虽费力但可成，需主动出击。'
  } else {
    summary += '用克体，受制之象，事情难成，需谨慎。'
  }

  let advice = ''
  if (tiYong.isGood) {
    advice = '此卦总体吉利，宜积极行动，把握时机。'
  } else {
    advice = '此卦需谨慎行事，不宜冒进，宜守不宜攻。'
  }

  if (dongYao.length > 0) {
    advice += `动爻在第${dongYao.map(d => ['初', '二', '三', '四', '五', '上'][d - 1]).join('、')}爻，请注意动爻爻辞的提示。`
  }

  let level: LiuyaoResult['interpretation']['level'] = '平'
  if (tiYong.relation === '比和' || tiYong.relation === '被生') {
    level = dongYao.length > 0 ? '吉' : '中吉'
  } else if (tiYong.relation === '生') {
    level = '平'
  } else if (tiYong.relation === '克') {
    level = '小凶'
  } else {
    level = '凶'
  }

  return { summary, advice, level }
}

export function calculateLiuyaoManual(yaos: YaoInfo[], question?: string): LiuyaoResult | null {
  if (yaos.length !== 6) return null

  const guaKey = getGuaKey(yaos.map(y => y.type === '阳' ? 1 : 0) as [number, number, number, number, number, number])
  const guaData = getGuaByKey(guaKey)

  const benGua = yaosToGuaInfo(yaos, guaData)
  const huGua = getHuGua(yaos)
  const bianGua = getBianGua(yaos)

  const dongYao = yaos.filter(y => y.isMoving).map(y => y.position)

  const tiYong = analyzeTiYong(benGua, dongYao)
  const interpretation = getInterpretation(benGua, tiYong, dongYao)

  return {
    divinationTime: new Date(),
    question,
    method: 'manual',
    benGua,
    huGua,
    bianGua,
    dongYao,
    tiYong,
    interpretation,
  }
}

export function calculateLiuyaoByTime(question?: string): LiuyaoResult | null {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours()

  const zhiIndex = Math.floor((hour + 1) / 2) % 12
  const yearZhi = ((year - 4) % 12) + 1

  const upperNum = (yearZhi + month + day) % 8
  const lowerNum = (yearZhi + month + day + zhiIndex) % 8
  const dongYaoNum = (yearZhi + month + day + zhiIndex) % 6

  const trigramKeys = Object.keys(TRIGRAM_DATA)
  const upperTriKey = trigramKeys[upperNum] || '111'
  const lowerTriKey = trigramKeys[lowerNum] || '000'

  const upperTri = TRIGRAM_DATA[upperTriKey]
  const lowerTri = TRIGRAM_DATA[lowerTriKey]

  const yaos: YaoInfo[] = []
  for (let i = 0; i < 3; i++) {
    yaos.push({
      position: i + 1,
      type: lowerTriKey[i] === '1' ? '阳' : '阴',
      isMoving: i + 1 === dongYaoNum + 1,
      text: '',
      explain: '',
    })
  }
  for (let i = 0; i < 3; i++) {
    yaos.push({
      position: i + 4,
      type: upperTriKey[i] === '1' ? '阳' : '阴',
      isMoving: i + 4 === dongYaoNum + 1,
      text: '',
      explain: '',
    })
  }

  const guaKey = lowerTriKey + upperTriKey
  const guaData = getGuaByKey(guaKey)

  const benGua = yaosToGuaInfo(yaos, guaData)
  const huGua = getHuGua(yaos)
  const bianGua = getBianGua(yaos)

  const dongYao = yaos.filter(y => y.isMoving).map(y => y.position)

  const tiYong = analyzeTiYong(benGua, dongYao)
  const interpretation = getInterpretation(benGua, tiYong, dongYao)

  return {
    divinationTime: now,
    question,
    method: 'time',
    benGua,
    huGua,
    bianGua,
    dongYao,
    tiYong,
    interpretation,
  }
}

export function tossCoins(): { type: '阳' | '阴'; isMoving: boolean } {
  const coins = [
    Math.random() < 0.5 ? 0 : 1,
    Math.random() < 0.5 ? 0 : 1,
    Math.random() < 0.5 ? 0 : 1,
  ]

  const backs = coins.filter(c => c === 1).length

  if (backs === 3) return { type: '阳', isMoving: true }
  if (backs === 0) return { type: '阴', isMoving: true }
  if (backs === 1) return { type: '阳', isMoving: false }
  return { type: '阴', isMoving: false }
}
