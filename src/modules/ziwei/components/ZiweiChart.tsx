import React from 'react'
import { MUTAGEN_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import type { ZiweiPalaceData } from '../utils/calculation'

interface PalaceCellProps {
  palace: ZiweiPalaceData
  onClick: (palace: ZiweiPalaceData) => void
}

const PalaceCell: React.FC<PalaceCellProps> = ({ palace, onClick }) => {
  const t = useTranslation()
  const hasSihua = palace.sihua.length > 0
  const desc = t.PALACE_DESCRIPTIONS[palace.name] || ''

  return (
    <div
      className={`relative border rounded-lg p-2 cursor-pointer transition-all duration-300 hover:border-gold/40 hover:bg-bg-secondary/50 min-h-[130px] ${
        palace.name === '命宫' ? 'border-gold/30 bg-gold/5' : 'border-gold/10 bg-bg-card/50'
      } ${hasSihua ? 'ring-1 ring-gold/20' : ''}`}
      onClick={() => onClick(palace)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${palace.name === '命宫' ? 'text-gold' : 'text-text-secondary'}`}>
          {palace.name}
          {palace.isBodyPalace && <span className="text-fire ml-1">{t.ZIWEI_UI.bodyPalaceMark}</span>}
        </span>
        <span className="text-text-muted text-[10px]">
          {palace.heavenlyStem}{palace.earthlyBranch}
        </span>
      </div>

      <p className="text-[10px] text-text-muted leading-tight mb-1 line-clamp-2">{desc}</p>

      {palace.majorStars.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mb-1">
          {palace.majorStars.map((star, i) => (
            <span
              key={i}
              className="text-xs px-1 py-0.5 rounded bg-gold/15 text-gold font-medium"
            >
              {star}
            </span>
          ))}
        </div>
      )}

      {palace.minorStars.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mb-1">
          {palace.minorStars.map((star, i) => (
            <span
              key={i}
              className="text-[10px] px-1 py-0.5 rounded bg-white/5 text-text-secondary"
            >
              {star}
            </span>
          ))}
        </div>
      )}

      {palace.sihua.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mt-1">
          {palace.sihua.map((sh, i) => {
            const parts = sh.split('·')
            const starName = parts[0]
            const mutagen = parts[1] || ''
            const colorClass = MUTAGEN_COLORS[mutagen] || 'bg-white/10 text-text-secondary'

            return (
              <span
                key={i}
                className={`text-[10px] px-1 py-0.5 rounded border ${colorClass}`}
              >
                {starName}·{mutagen}
              </span>
            )
          })}
        </div>
      )}

      {palace.decadal && palace.decadal.range[0] > 0 && (
        <div className="absolute bottom-1 right-1 text-[10px] text-text-muted">
          {palace.decadal.range[0]}-{palace.decadal.range[1]}
        </div>
      )}
    </div>
  )
}

interface ZiweiChartProps {
  palaces: ZiweiPalaceData[]
  onPalaceClick: (palace: ZiweiPalaceData) => void
}

const POSITIONS = [
  [5, 6, 7, 8],
  [4, -1, -1, 9],
  [3, -1, -1, 10],
  [2, 1, 0, 11],
]

const ZiweiChart: React.FC<ZiweiChartProps> = ({ palaces, onPalaceClick }) => {
  const t = useTranslation()
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="grid grid-cols-4 gap-1.5">
        {POSITIONS.flat().map((palaceIndex, cellIndex) => {
          if (palaceIndex === -1) {
            if (cellIndex === 5) {
              return (
                <div key={cellIndex} className="flex items-center justify-center p-2">
                  <div className="text-center">
                    <div className="text-gold font-serif text-lg">{t.ZIWEI_UI.chartCenterTitle}</div>
                    <div className="text-text-muted text-xs mt-1">{t.ZIWEI_UI.chartCenterSub}</div>
                  </div>
                </div>
              )
            }
            if (cellIndex === 6) {
              return (
                <div key={cellIndex} className="flex items-center justify-center p-2">
                  <div className="text-center text-text-muted text-xs">
                    <div>{t.ZIWEI_UI.directionSouth}</div>
                  </div>
                </div>
              )
            }
            if (cellIndex === 9) {
              return (
                <div key={cellIndex} className="flex items-center justify-center p-2">
                  <div className="text-center text-text-muted text-xs">
                    <div>{t.ZIWEI_UI.directionNorth}</div>
                  </div>
                </div>
              )
            }
            if (cellIndex === 10) {
              return (
                <div key={cellIndex} className="flex items-center justify-center p-2">
                  <div className="text-center text-text-muted text-xs">
                    <div>{t.ZIWEI_UI.directionCenter}</div>
                  </div>
                </div>
              )
            }
            return <div key={cellIndex} />
          }

          const palace = palaces.find(p => p.index === palaceIndex)
          if (!palace) return <div key={cellIndex} />

          return (
            <PalaceCell
              key={cellIndex}
              palace={palace}
              onClick={onPalaceClick}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ZiweiChart
