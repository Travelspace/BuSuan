// 真太阳时 (True Solar Time) 校正工具
//
// 计算基于 true-solar-time 库 (Jean Meeus 天文算法) 的均时差与经度修正。
// 时区与夏令时: 使用浏览器 Intl API (IANA 时区数据库), 自动处理 DST 切换。
//
// 流程:
//   1. 用户输入的出生时间为出生地时区的墙上时钟时间 (如 America/New_York 的 EDT/EST)
//   2. 通过 Intl API 将墙上时间转为绝对 UTC 时间戳 (自动处理夏令时)
//   3. 由该时刻实际 UTC 偏移 (含 DST) 推出标准经线
//   4. 调用 true-solar-time 库: 真太阳时 = 标准时 + (经度 - 标准经线)×4 + 均时差
//   5. 将结果折算回 UTC 读取, 得到真太阳时墙上时间 (年月日时分)

import { Solar, Lunar } from 'lunar-typescript'
import { getTrueSolarTimeDetail } from 'true-solar-time'

/**
 * 将某时区的墙上时钟时间转换为绝对 UTC 时间戳
 * 使用浏览器 Intl API 的 IANA 时区数据库, 自动处理夏令时
 *
 * @returns 绝对 UTC Date 与该时刻的 UTC 偏移 (分钟, 东经为正)
 */
function wallClockToAbsolute(
  year: number, month: number, day: number,
  hour: number, minute: number, timezone: string,
): { date: Date; utcOffsetMinutes: number } {
  // 1. 先用输入值构造一个"假定为 UTC"的时间戳
  const provisionalUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))

  // 2. 用 Intl 把这个 UTC 时间格式化到目标时区, 得到该绝对时刻在目标时区的墙上时间
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const parts = formatter.formatToParts(provisionalUTC)
  const getPart = (type: string): number => {
    const v = parts.find(p => p.type === type)?.value || '0'
    return parseInt(v, 10)
  }

  let tzHour = getPart('hour')
  if (tzHour === 24) tzHour = 0 // 凌晨 00:00 某些环境返回 24

  const tzWallAsUTC = Date.UTC(
    getPart('year'), getPart('month') - 1, getPart('day'),
    tzHour, getPart('minute'), 0,
  )

  // 3. UTC 偏移 (分钟, 东为正) = 目标时区墙上时间 - 假定UTC (同一绝对时刻)
  //    正值表示该时区在 UTC 东侧 (如 Asia/Shanghai 偏移 +480)
  const utcOffsetMinutes = (tzWallAsUTC - provisionalUTC.getTime()) / 60000

  // 4. 真实 UTC = 假定UTC - 偏移 (墙上 = UTC + 偏移 => UTC = 墙上 - 偏移)
  const realUTC = new Date(provisionalUTC.getTime() - utcOffsetMinutes * 60000)

  return { date: realUTC, utcOffsetMinutes }
}

export interface SolarTimeResult {
  /** 真太阳时 (绝对时间戳, 按 UTC 读取即为真太阳时墙上时间) */
  correctedDate: Date
  /** 原始输入时间 (绝对 UTC) */
  originalDate: Date
  /** 总校正量 (分钟) = 经度修正 + 均时差 */
  correctionMinutes: number
  /** 经度修正 (分钟), 相对当地标准经线 */
  longitudeCorrection: number
  /** 均时差 (分钟) */
  eotCorrection: number
}

/**
 * 计算真太阳时
 *
 * @param year 出生年
 * @param month 出生月 (1-12)
 * @param day 出生日
 * @param hour 出生时
 * @param minute 出生分
 * @param longitude 出生地经度 (东经为正, 西经为负)
 * @param timezone 出生地 IANA 时区名 (如 "Asia/Shanghai", "America/New_York")
 * @returns 真太阳时结果
 */
export function calculateTrueSolarTime(
  year: number, month: number, day: number,
  hour: number, minute: number,
  longitude: number, timezone: string,
): SolarTimeResult {
  // 墙上时钟 → 绝对 UTC (自动处理夏令时), 并取得该时刻实际 UTC 偏移
  const { date: originalDate, utcOffsetMinutes } = wallClockToAbsolute(
    year, month, day, hour, minute, timezone,
  )

  // 实际标准经线 = UTC 偏移 / 4 (1h = 15°), 夏令时已体现在偏移中
  //   - Asia/Shanghai: 偏移 +480 → 标准经线 120
  //   - America/New_York (EDT): 偏移 -240 → 标准经线 -60
  //   - America/New_York (EST): 偏移 -300 → 标准经线 -75
  const standardLongitude = utcOffsetMinutes / 4

  // 调用 true-solar-time 库计算均时差与经度修正
  // 真太阳时 = 标准时 + (经度 - 标准经线)×4 + 均时差
  const detail = getTrueSolarTimeDetail(originalDate, longitude, { standardLongitude })

  // 库返回的 date 按标准时区读取即为真太阳时; 折算回 UTC 读取:
  //   真太阳时(UTC读取) = detail.date + 标准经线×4分 = detail.date + utcOffsetMinutes
  const correctedDate = new Date(detail.date.getTime() + utcOffsetMinutes * 60000)

  return {
    correctedDate,
    originalDate,
    correctionMinutes: detail.totalOffset,
    longitudeCorrection: detail.lngOffset,
    eotCorrection: detail.eot,
  }
}

/**
 * 从日期时间字符串中解析出年月日时分
 * 支持 datetime-local 格式: "YYYY-MM-DDTHH:MM"
 */
function parseDateTimeStr(dateStr: string): {
  year: number; month: number; day: number; hour: number; minute: number
} {
  const [datePart, timePart] = dateStr.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = (timePart || '00:00').split(':').map(Number)
  return { year, month, day, hour, minute }
}

export interface CorrectedTimeResult {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  /** 是否进行了真太阳时校正 */
  corrected: boolean
  /** 校正详情 (仅校正时有值) */
  detail?: SolarTimeResult
}

/**
 * 根据出生信息获取校正后的阳历时间
 *
 * 流程:
 * 1. 解析日期时间字符串
 * 2. 若为农历, 先转为阳历
 * 3. 若有经度和时区, 进行真太阳时校正
 * 4. 返回校正后的年月日时分
 *
 * @param dateStr 日期时间字符串 (datetime-local 格式)
 * @param calendar 历法类型 ('solar' | 'lunar')
 * @param longitude 出生地经度 (可选)
 * @param timezone 出生地时区 (可选)
 * @returns 校正后的时间组件
 */
export function getCorrectedSolarTime(
  dateStr: string,
  calendar: 'solar' | 'lunar',
  longitude?: number,
  timezone?: string,
): CorrectedTimeResult {
  const { year, month, day, hour, minute } = parseDateTimeStr(dateStr)

  let solarYear = year
  let solarMonth = month
  let solarDay = day
  let solarHour = hour
  let solarMinute = minute

  // 农历先转阳历
  if (calendar === 'lunar') {
    const lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0)
    const solar = lunar.getSolar()
    solarYear = solar.getYear()
    solarMonth = solar.getMonth()
    solarDay = solar.getDay()
    solarHour = solar.getHour()
    solarMinute = solar.getMinute()
  }

  // 有经度和时区才进行真太阳时校正
  if (longitude !== undefined && timezone) {
    const result = calculateTrueSolarTime(
      solarYear, solarMonth, solarDay, solarHour, solarMinute,
      longitude, timezone,
    )
    return {
      year: result.correctedDate.getUTCFullYear(),
      month: result.correctedDate.getUTCMonth() + 1,
      day: result.correctedDate.getUTCDate(),
      hour: result.correctedDate.getUTCHours(),
      minute: result.correctedDate.getUTCMinutes(),
      corrected: true,
      detail: result,
    }
  }

  return {
    year: solarYear,
    month: solarMonth,
    day: solarDay,
    hour: solarHour,
    minute: solarMinute,
    corrected: false,
  }
}

/**
 * 格式化校正信息为可读字符串
 */
export function formatCorrectionDetail(detail: SolarTimeResult, lang: 'zh-CN' | 'en-US' = 'zh-CN'): string {
  const sign = detail.correctionMinutes >= 0 ? '+' : ''
  const minutes = Math.round(detail.correctionMinutes)
  const absMin = Math.abs(minutes)
  const h = Math.floor(absMin / 60)
  const m = absMin % 60

  const timeStr = h > 0 ? `${h}h${m}m` : `${m}m`

  if (lang === 'en-US') {
    return `TST correction: ${sign}${timeStr} (longitude ${Math.round(detail.longitudeCorrection)}min, EoT ${Math.round(detail.eotCorrection)}min)`
  }
  return `真太阳时校正: ${sign}${timeStr} (经度修正 ${Math.round(detail.longitudeCorrection)}分, 时差方程 ${Math.round(detail.eotCorrection)}分)`
}
