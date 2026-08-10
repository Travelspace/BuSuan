import { Solar } from 'lunar-typescript'
import { getCorrectedSolarTime } from './trueSolarTime'

/**
 * 将出生日期字符串转换为八字四柱干支显示（含真太阳时校正）
 * 供 bazi / ziwei 的出生信息摘要表单共用
 */
export function dateToBazi(
  dateStr: string,
  calendar: 'solar' | 'lunar' = 'solar',
  longitude?: number,
  timezone?: string,
): string {
  if (!dateStr) return ''

  // 真太阳时校正
  const corrected = getCorrectedSolarTime(dateStr, calendar, longitude, timezone)
  const { year, month, day, hour, minute } = corrected

  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0)
  const lunar = solar.getLunar()
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
