import React from 'react'
import type { DayInfo, MonthData } from '../utils/calculation'
import { WEEKDAY_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarGridProps {
  monthData: MonthData
  onDayClick: (day: DayInfo) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  selectedDay?: DayInfo | null
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthData,
  onDayClick,
  onPrevMonth,
  onNextMonth,
  selectedDay,
}) => {
  const t = useTranslation()
  const firstDayWeekday = monthData.days[0]?.weekday || 0
  const prevMonthDays: (null | DayInfo)[] = Array(firstDayWeekday).fill(null)

  const getDayClass = (day: DayInfo) => {
    const classes = ['cursor-pointer transition-all duration-200 rounded-md p-1 min-h-[70px] sm:min-h-[80px]']

    if (day.isToday) {
      classes.push('ring-2 ring-gold')
    }

    if (selectedDay && day.solar.day === selectedDay.solar.day) {
      classes.push('bg-gold/20 ring-2 ring-gold')
    }

    if (day.baziRelation) {
      if (day.baziRelation.score >= 75) {
        classes.push('bg-wood/10')
      } else if (day.baziRelation.score < 40) {
        classes.push('bg-fire/10')
      }
    }

    if (day.yi.length > 0 && day.ji.length === 0) {
      classes.push('hover:bg-wood/20')
    } else if (day.ji.length > 0 && day.yi.length === 0) {
      classes.push('hover:bg-fire/10')
    } else {
      classes.push('hover:bg-gold/10')
    }

    return classes.join(' ')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2 text-text-secondary hover:text-gold transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-xl font-serif text-gold">
          {t.CALENDAR_UI.monthHeaderLabel(monthData.year, monthData.month)}
        </h3>
        <button
          onClick={onNextMonth}
          className="p-2 text-text-secondary hover:text-gold transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {t.WEEKDAY_NAMES.map((name, i) => (
          <div key={name + i} className={`text-center text-xs font-medium ${WEEKDAY_COLORS[i]} py-1`}>
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {prevMonthDays.map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[80px]" />
        ))}

        {monthData.days.map(day => (
          <div
            key={day.solar.day}
            className={getDayClass(day)}
            onClick={() => onDayClick(day)}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm ${day.isToday ? 'text-gold font-bold' : 'text-text-primary'}`}>
                {day.solar.day}
              </span>
              {day.jieQi && (
                <span className="text-fire text-[10px]">{day.jieQi}</span>
              )}
            </div>
            <div className="text-text-muted text-[10px] mt-0.5">
              {day.lunar.dayStr}
            </div>
            {day.yi.length > 0 && (
              <div className="text-wood text-[10px] mt-0.5 truncate">
                {t.CALENDAR_UI.yiPrefix}{day.yi.slice(0, 2).join('·')}
              </div>
            )}
            {day.baziRelation && (
              <div className={`text-[10px] mt-0.5 ${day.baziRelation.score >= 55 ? 'text-wood' : 'text-fire'}`}>
                {day.baziRelation.score >= 75 ? '★' : day.baziRelation.score >= 55 ? '○' : '△'}
                {day.baziRelation.score}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarGrid
