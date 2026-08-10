import React from 'react'
import { Card } from '../../../components/common'
import { LEVEL_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import type { YearFortune } from '../utils/calculation'

interface KeyYearsProps {
  fortunes: YearFortune[]
}

const KeyYears: React.FC<KeyYearsProps> = ({ fortunes }) => {
  const t = useTranslation()
  const keyFortunes = fortunes.filter(f => f.isKeyYear)

  if (keyFortunes.length === 0) return null

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-4">{t.FORTUNE.keyYearsTitle}</h3>

      <div className="space-y-3">
        {keyFortunes.map((f) => {
          const colors = LEVEL_COLORS[f.level]
          return (
            <div
              key={f.year}
              className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-text-primary font-medium">
                  {f.year}{t.FORTUNE.yearSuffix} ({f.ganZhi})
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${colors.text}`}>
                  {f.level}
                </span>
              </div>
              {f.keyReason && (
                <p className="text-gold text-sm">{f.keyReason}</p>
              )}
              <p className="text-text-secondary text-xs mt-1">{f.summary}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default KeyYears
