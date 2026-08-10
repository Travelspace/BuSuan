import React from 'react'
import { Card } from '../../../components/common'
import { useTranslation } from '../../../i18n'
import type { FortuneResult } from '../utils/calculation'

interface FortuneChartProps {
  result: FortuneResult
}

const FortuneChart: React.FC<FortuneChartProps> = ({ result }) => {
  const t = useTranslation()
  const { fortunes, overallTrend, bestYear, worstYear } = result
  const maxScore = 100
  const chartHeight = 160
  const chartWidth = 800
  const padding = { top: 20, right: 30, bottom: 35, left: 40 }

  const trend = t.FORTUNE_TREND[overallTrend]

  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  const points = fortunes.map((f, i) => {
    const x = padding.left + (i / (fortunes.length - 1)) * plotWidth
    const y = padding.top + plotHeight - (f.score / maxScore) * plotHeight
    return { x, y, score: f.score, year: f.year, level: f.level }
  })

  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const cpx1 = prev.x + (p.x - prev.x) / 3
      const cpx2 = prev.x + (2 * (p.x - prev.x)) / 3
      return `C ${cpx1} ${prev.y}, ${cpx2} ${p.y}, ${p.x} ${p.y}`
    })
    .join(' ')

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-4">{t.FORTUNE.chartTitle}</h3>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <span className="text-text-secondary">{trend.text}</span>
        <span className="text-text-muted text-xs">{trend.desc}</span>
      </div>

      <div className="relative w-full" style={{ maxWidth: '100%' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full"
          style={{ maxHeight: '280px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((val) => {
            const y = padding.top + plotHeight - (val / maxScore) * plotHeight
            return (
              <g key={val}>
                <line
                  x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8} y={y + 4}
                  fill="rgba(255,255,255,0.35)"
                  fontSize="11"
                  textAnchor="end"
                >
                  {val}
                </text>
              </g>
            )
          })}

          <path d={areaD} fill="url(#areaGradient)" />

          <path
            d={pathD}
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {points.map((p, i) => {
            const isBest = p.year === bestYear
            const isWorst = p.year === worstYear
            const color = isBest ? '#27ae60' : isWorst ? '#e74c3c' : '#d4af37'

            return (
              <g key={i}>
                <circle
                  cx={p.x} cy={p.y}
                  r={isBest || isWorst ? 5 : 3.5}
                  fill={color}
                  stroke={isBest || isWorst ? color : 'transparent'}
                  strokeWidth="2"
                />
                <text
                  x={p.x} y={padding.top + plotHeight + 18}
                  fill="rgba(255,255,255,0.5)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {p.year}
                </text>
                <text
                  x={p.x} y={p.y - 10}
                  fill={color}
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight={isBest || isWorst ? 'bold' : 'normal'}
                >
                  {p.score}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-wood" />
          <span>{t.FORTUNE.bestYear}: {bestYear}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-fire" />
          <span>{t.FORTUNE.worstYear}: {worstYear}</span>
        </div>
      </div>
    </Card>
  )
}

export default FortuneChart
