import React from 'react'
import { Button, Card } from '../../../components/common'
import { useAppStore } from '../../../store'
import { useTranslation } from '../../../i18n'
import { dateToBazi } from '../utils/calculation'
import type { BirthInfo } from '../../../types'

interface BirthFormProps {
  onSubmit: (birthInfo: BirthInfo) => void
  loading?: boolean
}

const BirthForm: React.FC<BirthFormProps> = ({ onSubmit, loading = false }) => {
  const { birthInfo } = useAppStore()
  const t = useTranslation()

  const hasInfo = !!birthInfo.date

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasInfo) return
    onSubmit(birthInfo)
  }

  if (!hasInfo) {
    return (
      <Card hover={false}>
        <div className="text-center py-8">
          <p className="text-text-muted mb-4">{t.BAZI_UI.goFillHint}</p>
          <Button variant="secondary" onClick={() => window.location.href = '/profile'}>
            {t.BAZI_UI.goFill}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">{t.BAZI_UI.birthInfoTitle}</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          {birthInfo.name && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t.PROFILE_UI.nameLabel}</span>
              <span className="text-text-primary">{birthInfo.name}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t.PROFILE_UI.genderLabel}</span>
            <span className="text-text-primary">{birthInfo.gender === 'male' ? t.PROFILE_UI.male : t.PROFILE_UI.female}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t.PROFILE_UI.calendarTypeLabel}</span>
            <span className="text-text-primary">{birthInfo.calendar === 'solar' ? t.PROFILE_UI.solar : t.PROFILE_UI.lunar}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">{t.BAZI_UI.fourPillarsTitle}</span>
            <span className="text-text-primary">{dateToBazi(birthInfo.date, birthInfo.calendar, birthInfo.longitude, birthInfo.timezone)}</span>
          </div>
          {birthInfo.location && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">{t.PROFILE_UI.birthLocationLabel}</span>
              <span className="text-text-primary">{birthInfo.location}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading} className="w-full">
            {t.BAZI_UI.startCalc}
          </Button>
        </div>

        <div className="border-t border-gold/10 pt-4">
          <p className="text-text-muted text-xs mb-2">{t.PROFILE_UI.shichenTableTitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {t.SHICHEN_MAP.map((item) => (
              <div
                key={item.index}
                className="text-xs text-text-secondary bg-bg-secondary/30 rounded px-2 py-1 flex justify-between"
              >
                <span>{item.label}</span>
                <span className="text-text-muted">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Card>
  )
}

export default BirthForm
