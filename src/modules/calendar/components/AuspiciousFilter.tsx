import React from 'react'
import { Card } from '../../../components/common'
import { EVENT_TYPES } from '../utils/constants'
import type { DayInfo, MonthData } from '../utils/calculation'
import { filterAuspiciousDays } from '../utils/calculation'

interface AuspiciousFilterProps {
  monthData: MonthData
  selectedEvent: string
  onEventChange: (event: string) => void
}

const AuspiciousFilter: React.FC<AuspiciousFilterProps> = ({
  monthData,
  selectedEvent,
  onEventChange,
}) => {
  const auspiciousDays = selectedEvent
    ? filterAuspiciousDays(monthData, selectedEvent)
    : []

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">吉日筛选</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {EVENT_TYPES.map(event => (
          <button
            key={event.key}
            onClick={() => onEventChange(event.key === selectedEvent ? '' : event.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              event.key === selectedEvent
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-primary/30 text-text-secondary hover:bg-gold/20 hover:text-gold'
            }`}
          >
            {event.icon} {event.label}
          </button>
        ))}
      </div>

      {selectedEvent && (
        <div>
          <div className="text-text-secondary text-sm mb-3">
            {monthData.year}年{monthData.month}月适合
            <span className="text-gold">{EVENT_TYPES.find(e => e.key === selectedEvent)?.label}</span>
            的吉日共
            <span className="text-wood">{auspiciousDays.length}</span>天
          </div>

          {auspiciousDays.length > 0 ? (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {auspiciousDays.map(day => (
                <div
                  key={day.solar.day}
                  className="flex items-center justify-between bg-bg-primary/30 rounded-md p-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gold font-serif text-lg w-8 text-center">
                      {day.solar.day}
                    </span>
                    <div>
                      <div className="text-text-primary text-sm">
                        {day.lunar.monthStr}月{day.lunar.dayStr}
                      </div>
                      <div className="text-text-muted text-xs">
                        {day.ganZhi.day}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                    {day.yi.slice(0, 3).map((y, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-wood/10 text-wood text-[10px] rounded">
                        {y}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-text-muted text-sm">
              本月无适合的吉日
            </div>
          )}
        </div>
      )}

      {!selectedEvent && (
        <div className="text-center py-4 text-text-muted text-sm">
          请选择事项类型筛选吉日
        </div>
      )}
    </Card>
  )
}

export default AuspiciousFilter
