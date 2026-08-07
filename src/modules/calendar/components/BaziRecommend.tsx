import React from 'react'
import { Card } from '../../../components/common'
import type { MonthData } from '../utils/calculation'

interface BaziRecommendProps {
  monthData: MonthData
}

const BaziRecommend: React.FC<BaziRecommendProps> = ({ monthData }) => {
  const daysWithRelation = monthData.days.filter(d => d.baziRelation)

  const bestDays = [...daysWithRelation]
    .sort((a, b) => (b.baziRelation?.score || 0) - (a.baziRelation?.score || 0))
    .slice(0, 5)

  const worstDays = [...daysWithRelation]
    .sort((a, b) => (a.baziRelation?.score || 0) - (b.baziRelation?.score || 0))
    .slice(0, 3)

  if (daysWithRelation.length === 0) return null

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">八字个性化推荐</h3>

      <div className="mb-4">
        <h4 className="text-wood text-sm font-medium mb-2">★ 推荐吉日（与八字最相合）</h4>
        <div className="space-y-2">
          {bestDays.map(day => (
            <div key={day.solar.day} className="flex items-center justify-between bg-wood/5 rounded-md p-2.5">
              <div className="flex items-center gap-3">
                <span className="text-gold font-serif text-lg w-8 text-center">{day.solar.day}</span>
                <div>
                  <div className="text-text-primary text-sm">
                    {day.lunar.monthStr}月{day.lunar.dayStr} · {day.ganZhi.day}
                  </div>
                  {day.baziRelation?.heDesc && (
                    <div className="text-wood text-xs mt-0.5">{day.baziRelation.heDesc}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-wood text-sm font-medium">{day.baziRelation?.score}分</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-fire text-sm font-medium mb-2">✗ 需避开日期（与八字相冲）</h4>
        <div className="space-y-2">
          {worstDays.map(day => (
            <div key={day.solar.day} className="flex items-center justify-between bg-fire/5 rounded-md p-2.5">
              <div className="flex items-center gap-3">
                <span className="text-gold font-serif text-lg w-8 text-center">{day.solar.day}</span>
                <div>
                  <div className="text-text-primary text-sm">
                    {day.lunar.monthStr}月{day.lunar.dayStr} · {day.ganZhi.day}
                  </div>
                  {day.baziRelation?.chongDesc && (
                    <div className="text-fire text-xs mt-0.5">{day.baziRelation.chongDesc}</div>
                  )}
                  {day.baziRelation?.xingDesc && (
                    <div className="text-fire text-xs mt-0.5">{day.baziRelation.xingDesc}</div>
                  )}
                  {day.baziRelation?.haiDesc && (
                    <div className="text-fire text-xs mt-0.5">{day.baziRelation.haiDesc}</div>
                  )}
                  {day.baziRelation?.ziXingDesc && (
                    <div className="text-fire text-xs mt-0.5">{day.baziRelation.ziXingDesc}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fire text-sm font-medium">{day.baziRelation?.score}分</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default BaziRecommend
