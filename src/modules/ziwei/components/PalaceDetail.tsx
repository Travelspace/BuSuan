import React from 'react'
import { Modal } from '../../../components/common'
import { MUTAGEN_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import type { ZiweiPalaceData } from '../utils/calculation'

const SIHUA_LABEL_MAP = (t: ReturnType<typeof useTranslation>): Record<string, string> => ({
  '禄': t.ZIWEI_FORTUNE.sihuaLu.label,
  '权': t.ZIWEI_FORTUNE.sihuaQuan.label,
  '科': t.ZIWEI_FORTUNE.sihuaKe.label,
  '忌': t.ZIWEI_FORTUNE.sihuaJi.label,
})

interface PalaceDetailProps {
  palace: ZiweiPalaceData | null
  isOpen: boolean
  onClose: () => void
}

const PalaceDetail: React.FC<PalaceDetailProps> = ({ palace, isOpen, onClose }) => {
  const t = useTranslation()
  if (!palace) return null

  const interpretation = t.PALACE_INTERPRETATIONS[palace.name]
  const desc = t.PALACE_DESCRIPTIONS[palace.name] || ''

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={palace.name} size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-text-secondary">{t.ZIWEI_UI.palaceGanZhiLabel}</span>
          <span className="text-gold font-serif">{palace.heavenlyStem}{palace.earthlyBranch}</span>
          {palace.isBodyPalace && (
            <span className="px-2 py-0.5 rounded bg-fire/20 text-fire text-xs">{t.ZIWEI_UI.bodyPalaceLabel}</span>
          )}
        </div>

        <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
          <p className="text-text-primary text-sm">{desc}</p>
        </div>

        {interpretation && (
          <>
            <div>
              <h4 className="text-gold text-sm font-medium mb-2">{t.ZIWEI_UI.aspectsTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {interpretation.aspects.map((aspect, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-bg-secondary/50 text-text-secondary border border-white/10">
                    {aspect}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-gold text-sm font-medium mb-2">{t.ZIWEI_UI.keyPointsTitle}</h4>
              <ul className="space-y-1">
                {interpretation.keyPoints.map((point, i) => (
                  <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {palace.majorStars.length > 0 && (
          <div>
            <h4 className="text-gold text-sm font-medium mb-2">{t.ZIWEI_UI.majorStarsTitle}</h4>
            <div className="space-y-2">
              {palace.majorStars.map((star, i) => (
                <div key={i} className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
                  <div className="flex items-center gap-2">
                    <span className="text-gold font-serif text-lg">{star}</span>
                    {palace.sihua
                      .filter(sh => sh.startsWith(star))
                      .map((sh, j) => {
                        const mutagen = sh.split('·')[1]
                        const colorClass = MUTAGEN_COLORS[mutagen] || ''
                        return (
                          <span key={j} className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
                            {SIHUA_LABEL_MAP(t)[mutagen] || mutagen}
                          </span>
                        )
                      })}
                  </div>
                  <p className="text-text-muted text-xs mt-1">
                    {t.MAJOR_STAR_DESCRIPTIONS[star] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {palace.minorStars.length > 0 && (
          <div>
            <h4 className="text-text-secondary text-sm font-medium mb-2">{t.ZIWEI_UI.minorStarsTitle}</h4>
            <div className="flex flex-wrap gap-1.5">
              {palace.minorStars.map((star, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded bg-white/5 text-text-secondary border border-white/10"
                >
                  {star}
                  {palace.sihua
                    .filter(sh => sh.startsWith(star))
                    .map((sh, j) => {
                      const mutagen = sh.split('·')[1]
                      return (
                        <span key={j} className="ml-1 text-fire">·{mutagen}</span>
                      )
                    })}
                </span>
              ))}
            </div>
          </div>
        )}

        {palace.decadal && palace.decadal.range[0] > 0 && (
          <div className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
            <h4 className="text-text-secondary text-sm font-medium mb-1">{t.ZIWEI_UI.decadalTitle}</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gold font-serif">{palace.decadal.heavenlyStem}{palace.decadal.earthlyBranch}</span>
              <span className="text-text-muted">
                {palace.decadal.range[0]}-{palace.decadal.range[1]}{t.ZIWEI_FORTUNE.ageSuffix}
              </span>
            </div>
          </div>
        )}

        {palace.ages.length > 0 && (
          <div>
            <h4 className="text-text-secondary text-sm font-medium mb-2">{t.ZIWEI_UI.smallLimitTitle}</h4>
            <div className="flex flex-wrap gap-1">
              {palace.ages.map((age, i) => (
                <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-bg-secondary/30 text-text-muted">
                  {age}
                </span>
              ))}
            </div>
          </div>
        )}

        {interpretation && (
          <div className="p-3 bg-wood/5 rounded-lg border border-wood/20">
            <h4 className="text-wood text-sm font-medium mb-2">{t.ZIWEI_UI.tipsTitle}</h4>
            <ul className="space-y-1">
              {interpretation.tips.map((tip, i) => (
                <li key={i} className="text-text-secondary text-sm flex items-start gap-2">
                  <span className="text-wood mt-1">→</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default PalaceDetail
