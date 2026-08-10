import React from 'react'
import { Modal } from '../../../components/common'
import type { DayInfo } from '../utils/calculation'
import { useTranslation } from '../../../i18n'

interface DayDetailProps {
  day: DayInfo | null
  isOpen: boolean
  onClose: () => void
}

const DayDetail: React.FC<DayDetailProps> = ({ day, isOpen, onClose }) => {
  const t = useTranslation()
  if (!day) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.CALENDAR_UI.dayDetailTitle(day.solar.month, day.solar.day)} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">{t.CALENDAR_UI.solarLabel}</div>
            <div className="text-text-primary">
              {day.solar.year}-{day.solar.month}-{day.solar.day}
            </div>
            <div className="text-text-secondary text-sm">{t.CALENDAR_UI.weekdayFull[day.weekday]}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">{t.CALENDAR_UI.lunarLabel}</div>
            <div className="text-text-primary">
              {day.lunar.monthStr}月{day.lunar.dayStr}
            </div>
            <div className="text-text-secondary text-sm">{day.shengXiao}{t.CALENDAR_UI.yearLabel}</div>
          </div>
        </div>

        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-1">{t.CALENDAR_UI.ganZhiLabel}</div>
          <div className="flex gap-4">
            <div>
              <span className="text-text-secondary text-xs">{t.CALENDAR_UI.yearLabel}</span>
              <span className="text-gold">{day.ganZhi.year}</span>
            </div>
            <div>
              <span className="text-text-secondary text-xs">{t.CALENDAR_UI.monthLabel}</span>
              <span className="text-gold">{day.ganZhi.month}</span>
            </div>
            <div>
              <span className="text-text-secondary text-xs">{t.CALENDAR_UI.dayLabel}</span>
              <span className="text-gold">{day.ganZhi.day}</span>
            </div>
          </div>
        </div>

        {day.jieQi && (
          <div className="bg-fire/10 border border-fire/20 rounded-md p-3">
            <span className="text-fire text-sm">🌿 {t.CALENDAR_UI.jieQiLabel}{day.jieQi}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-wood text-sm font-medium mb-2">{t.CALENDAR_UI.yiLabel}</div>
            <div className="flex flex-wrap gap-1.5">
              {day.yi.length > 0 ? day.yi.map((y, i) => (
                <span key={i} className="px-2 py-0.5 bg-wood/10 text-wood text-xs rounded">
                  {y}
                </span>
              )) : (
                <span className="text-text-muted text-xs">{t.CALENDAR_UI.none}</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-fire text-sm font-medium mb-2">{t.CALENDAR_UI.jiLabel}</div>
            <div className="flex flex-wrap gap-1.5">
              {day.ji.length > 0 ? day.ji.map((j, i) => (
                <span key={i} className="px-2 py-0.5 bg-fire/10 text-fire text-xs rounded">
                  {j}
                </span>
              )) : (
                <span className="text-text-muted text-xs">{t.CALENDAR_UI.none}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">{t.CALENDAR_UI.chongShaLabel}</div>
            <div className="text-text-primary text-sm">{day.chong} {day.sha}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">{t.CALENDAR_UI.jiShenLabel}</div>
            <div className="text-wood text-sm">{day.jiShen.join('、') || t.CALENDAR_UI.none}</div>
          </div>
        </div>

        {day.baziRelation && (
          <div className={`rounded-md p-3 border ${
            day.baziRelation.score >= 55
              ? 'bg-wood/10 border-wood/20'
              : 'bg-fire/10 border-fire/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gold text-sm font-medium">{t.CALENDAR_UI.baziMatchLabel}</span>
              <span className={`text-lg font-serif ${
                day.baziRelation.score >= 75 ? 'text-wood' : day.baziRelation.score >= 55 ? 'text-gold' : 'text-fire'
              }`}>
                {day.baziRelation.score}{t.CALENDAR_UI.scoreSuffix}
              </span>
            </div>
            {day.baziRelation.heDesc && (
              <div className="text-wood text-xs mb-1">{t.CALENDAR_UI.heDescLabel}{day.baziRelation.heDesc}</div>
            )}
            {day.baziRelation.chongDesc && (
              <div className="text-fire text-xs mb-1">{t.CALENDAR_UI.chongDescLabel}{day.baziRelation.chongDesc}</div>
            )}
            {day.baziRelation.xingDesc && (
              <div className="text-fire text-xs mb-1">{t.CALENDAR_UI.xingDescLabel}{day.baziRelation.xingDesc}</div>
            )}
            {day.baziRelation.haiDesc && (
              <div className="text-fire text-xs mb-1">{t.CALENDAR_UI.haiDescLabel}{day.baziRelation.haiDesc}</div>
            )}
            {day.baziRelation.ziXingDesc && (
              <div className="text-fire text-xs mb-1">{t.CALENDAR_UI.ziXingDescLabel}{day.baziRelation.ziXingDesc}</div>
            )}
            <div className="text-text-secondary text-xs mt-2">{day.baziRelation.suggestion}</div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DayDetail
