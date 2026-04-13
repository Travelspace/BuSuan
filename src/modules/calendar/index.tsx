import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { getMonthData, type DayInfo, type MonthData } from './utils/calculation'
import { MODULE_NAMES, MODULE_DESCRIPTIONS } from '../../utils/constants'
import { Card } from '../../components/common'
import CalendarGrid from './components/CalendarGrid'
import DayDetail from './components/DayDetail'
import AuspiciousFilter from './components/AuspiciousFilter'
import BaziRecommend from './components/BaziRecommend'

const CalendarModule: React.FC = () => {
  const { baziResult } = useAppStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState('')

  const monthData: MonthData = useCallback(
    () => getMonthData(year, month, baziResult),
    [year, month, baziResult]
  )()

  const handlePrevMonth = useCallback(() => {
    if (month === 1) {
      setMonth(12)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }, [month])

  const handleNextMonth = useCallback(() => {
    if (month === 12) {
      setMonth(1)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }, [month])

  const handleDayClick = useCallback((day: DayInfo) => {
    setSelectedDay(day)
    setDetailOpen(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{MODULE_NAMES.calendar}</h2>
        <p className="text-text-secondary">{MODULE_DESCRIPTIONS.calendar}</p>
      </div>

      {baziResult && (
        <Card hover={false} className="bg-wood/5 border-wood/20">
          <div className="flex items-center gap-2">
            <span className="text-wood">✓</span>
            <span className="text-wood text-sm">已关联八字排盘数据，日历中显示个性化吉日推荐</span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card hover={false}>
            <CalendarGrid
              monthData={monthData}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              selectedDay={selectedDay}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <AuspiciousFilter
            monthData={monthData}
            selectedEvent={selectedEvent}
            onEventChange={setSelectedEvent}
          />

          {baziResult && (
            <BaziRecommend monthData={monthData} />
          )}
        </div>
      </div>

      <DayDetail
        day={selectedDay}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  )
}

export default CalendarModule
