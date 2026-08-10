import React from 'react'
import { Card } from '../../../components/common'
import type { NameResult } from '../../../types'
import { WUXING_COLORS, WUXING_BG_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'

interface BaziMatchProps {
  result: NameResult
}

const BaziMatch: React.FC<BaziMatchProps> = ({ result }) => {
  const t = useTranslation()
  const { baziMatch } = result
  if (!baziMatch) return null

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.NAME_UI.baziMatchTitle}</h3>

      <div className="text-center mb-6">
        <div className="text-text-muted text-sm mb-1">{t.NAME_UI.matchDegree}</div>
        <div className={`text-4xl font-serif ${baziMatch.matchScore >= 70 ? 'text-wood' : baziMatch.matchScore >= 50 ? 'text-gold' : 'text-fire'}`}>
          {baziMatch.matchScore}%
        </div>
        <div className="w-full bg-bg-primary rounded-full h-2 mt-3">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: `${baziMatch.matchScore}%`,
              background: baziMatch.matchScore >= 70
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : baziMatch.matchScore >= 50
                  ? 'linear-gradient(90deg, #d4af37, #f4d03f)'
                  : 'linear-gradient(90deg, #e74c3c, #c0392b)',
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.nameWuxing}</div>
          <div className="flex gap-2 flex-wrap">
            {baziMatch.wuxingMatch.name.map((wx, i) => (
              <span key={i} className={`px-2 py-1 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>
                {wx}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.baziWuxing}</div>
          <div className="flex gap-2 flex-wrap">
            {baziMatch.wuxingMatch.bazi.map((wx, i) => (
              <span key={i} className={`px-2 py-1 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>
                {wx}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {baziMatch.suggestions.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-gold mt-0.5">•</span>
            <span className="text-text-secondary">{s}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default BaziMatch
