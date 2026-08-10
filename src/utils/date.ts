export const getAge = (birthDate: Date): number => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export { getWuXingByGan, getWuXingByZhi, wuXingRelation } from './wuxing'

export const getTimeIndex = (hour: number, minute: number): number => {
  if (hour === 0 && minute === 0) return 0
  if (hour === 23 && minute >= 30) return 12
  return Math.floor((hour + 1) / 2)
}
