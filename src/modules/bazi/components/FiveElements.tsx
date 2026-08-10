import React from 'react'
import { Card } from '../../../components/common'
import { WUXING_BG, getWuXingColor } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import { useAnimatedWidth } from '../../../hooks/useAnimatedWidth'
import type { WuXing } from '../../../types'

interface FiveElementsProps {
  fiveElements: Record<WuXing, number>
  xiYongShen?: {
    xiShen: WuXing[]
    yongShen: WuXing
    jiShen: WuXing[]
  }
}

function WuXingBar({ wx, count, total, maxVal, xiYongShen, index }: {
  wx: WuXing
  count: number
  total: number
  maxVal: number
  xiYongShen?: { xiShen: WuXing[]; yongShen: WuXing; jiShen: WuXing[] }
  index: number
}) {
  const t = useTranslation()
  const percent = total > 0 ? (count / total * 100) : 0
  const barWidth = maxVal > 0 ? (count / maxVal * 100) : 0
  const animatedWidth = useAnimatedWidth(barWidth, 100 + index * 80)
  const isXi = xiYongShen?.xiShen.includes(wx)
  const isYong = xiYongShen?.yongShen === wx
  const isJi = xiYongShen?.jiShen.includes(wx)

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-serif text-lg border ${WUXING_BG[wx]}`}>
        {wx}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-text-primary text-sm">{t.WUXING_DESCRIPTIONS[wx]}</span>
          <div className="flex items-center gap-2">
            {isYong && <span className="text-xs px-1.5 py-0.5 rounded bg-gold/20 text-gold">{t.BAZI_UI.yongShenLabel}</span>}
            {isXi && <span className="text-xs px-1.5 py-0.5 rounded bg-wood/20 text-wood">{t.BAZI_UI.xiShenLabel}</span>}
            {isJi && <span className="text-xs px-1.5 py-0.5 rounded bg-fire/20 text-fire">{t.BAZI_UI.jiShenLabel}</span>}
            <span className="text-text-secondary text-sm">{count.toFixed(1)}</span>
            <span className="text-text-muted text-xs">({percent.toFixed(0)}%)</span>
          </div>
        </div>
        <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${animatedWidth}%`,
              backgroundColor: getWuXingColor(wx),
            }}
          />
        </div>
      </div>
    </div>
  )
}

const FiveElements: React.FC<FiveElementsProps> = ({ fiveElements, xiYongShen }) => {
  const t = useTranslation()
  const total = Object.values(fiveElements).reduce((a, b) => a + b, 0)
  const sorted = (Object.entries(fiveElements) as [WuXing, number][])
    .sort((a, b) => b[1] - a[1])
  const maxVal = Math.max(...Object.values(fiveElements), 1)

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">{t.BAZI_UI.fiveElementsTitle}</h3>

      <div className="space-y-4 mb-6">
        {sorted.map(([wx, count], index) => (
          <WuXingBar
            key={wx}
            wx={wx}
            count={count}
            total={total}
            maxVal={maxVal}
            xiYongShen={xiYongShen}
            index={index}
          />
        ))}
      </div>

      {xiYongShen && (
        <div className="border-t border-gold/10 pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">{t.BAZI_UI.yongShenLabel}：</span>
            <span className={`px-2 py-0.5 rounded text-sm font-serif border ${WUXING_BG[xiYongShen.yongShen]}`}>
              {xiYongShen.yongShen}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">{t.BAZI_UI.xiShenLabel}：</span>
            <div className="flex gap-1">
              {xiYongShen.xiShen.map((wx) => (
                <span key={wx} className={`px-2 py-0.5 rounded text-sm font-serif border ${WUXING_BG[wx]}`}>
                  {wx}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">{t.BAZI_UI.jiShenLabel}：</span>
            <div className="flex gap-1">
              {xiYongShen.jiShen.map((wx) => (
                <span key={wx} className={`px-2 py-0.5 rounded text-sm font-serif border ${WUXING_BG[wx]}`}>
                  {wx}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-bg-secondary/30 rounded-lg">
        <p className="text-text-muted text-xs">
          {t.BAZI_UI.fiveElementsAdvice}{sorted[0][1] > sorted[sorted.length - 1][1] * 3
            ? t.BAZI_UI.fiveElementsStrong(sorted[0][0], sorted[sorted.length - 1][0])
            : t.BAZI_UI.fiveElementsBalanced
          }
        </p>
      </div>
    </Card>
  )
}

export default FiveElements
