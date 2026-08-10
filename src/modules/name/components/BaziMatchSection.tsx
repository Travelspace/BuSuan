/**
 * 八字匹配展示区
 * 展示匹配分、逐字五行、喜用神对照、逐项说明与建议
 */
import React from 'react'
import { Card } from '../../../components/common'
import type { WuXing } from '../../../types'
import type { BaziAnalysis } from '../utils/types'
import { WUXING_COLORS, WUXING_BG_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'

interface BaziMatchSectionProps {
  baziAnalysis: BaziAnalysis
  /** 完整姓名（用于逐字展示） */
  name: string
}

const BaziMatchSection: React.FC<BaziMatchSectionProps> = ({ baziAnalysis, name }) => {
  const t = useTranslation()
  const chars = [...name]
  const { matchScore, nameWuXing, xiYongUsed, missingWuXing, details, suggestions } = baziAnalysis

  const scoreColor = matchScore >= 70 ? 'text-wood' : matchScore >= 50 ? 'text-gold' : 'text-fire'
  const scoreGradient = matchScore >= 70
    ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
    : matchScore >= 50
      ? 'linear-gradient(90deg, #d4af37, #f4d03f)'
      : 'linear-gradient(90deg, #e74c3c, #c0392b)'

  const renderWuxingTag = (wx: WuXing | null, key: number) => {
    if (!wx) {
      return (
        <span key={key} className="px-2 py-1 rounded text-xs bg-bg-primary/50 text-text-muted">
          {t.NAME_UI.wuxingUnknown}
        </span>
      )
    }
    return (
      <span key={key} className={`px-2 py-1 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>
        {wx}
      </span>
    )
  }

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.NAME_UI.baziSectionTitle}</h3>

      {/* 匹配分 */}
      <div className="text-center mb-6">
        <div className="text-text-muted text-sm mb-1">{t.NAME_UI.matchScoreLabel}</div>
        <div className={`text-4xl font-serif ${scoreColor}`}>{matchScore}</div>
        <div className="w-full bg-bg-primary rounded-full h-2 mt-3">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${matchScore}%`, background: scoreGradient }}
          />
        </div>
      </div>

      {/* 逐字五行 */}
      <div className="bg-bg-primary/30 rounded-md p-3 mb-4">
        <div className="text-text-muted text-xs mb-2">{t.NAME_UI.nameWuxingLabel}</div>
        <div className="flex gap-3 flex-wrap">
          {chars.map((char, i) => (
            <div key={i} className="text-center">
              <div className="text-text-primary text-lg font-serif mb-1">{char}</div>
              {renderWuxingTag(nameWuXing[i] ?? null, i)}
            </div>
          ))}
        </div>
      </div>

      {/* 喜用神对照 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.xiShenLabel}</div>
          <div className="flex gap-1.5 flex-wrap">
            {xiYongUsed.xiShen.length > 0
              ? xiYongUsed.xiShen.map((wx, i) => (
                <span key={i} className={`px-2 py-0.5 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>{wx}</span>
              ))
              : <span className="text-text-muted text-xs">—</span>}
          </div>
        </div>
        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.yongShenLabel}</div>
          <div className="flex gap-1.5 flex-wrap">
            {xiYongUsed.yongShen
              ? <span className={`px-2 py-0.5 rounded text-xs ${WUXING_BG_COLORS[xiYongUsed.yongShen]} ${WUXING_COLORS[xiYongUsed.yongShen]}`}>{xiYongUsed.yongShen}</span>
              : <span className="text-text-muted text-xs">—</span>}
          </div>
        </div>
        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.jiShenLabel}</div>
          <div className="flex gap-1.5 flex-wrap">
            {xiYongUsed.jiShen.length > 0
              ? xiYongUsed.jiShen.map((wx, i) => (
                <span key={i} className={`px-2 py-0.5 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>{wx}</span>
              ))
              : <span className="text-text-muted text-xs">—</span>}
          </div>
        </div>
      </div>

      {/* 八字所缺 */}
      {missingWuXing.length > 0 && (
        <div className="bg-bg-primary/30 rounded-md p-3 mb-4">
          <div className="text-text-muted text-xs mb-2">{t.NAME_UI.missingWuXingLabel}</div>
          <div className="flex gap-1.5 flex-wrap">
            {missingWuXing.map((wx, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-xs ${WUXING_BG_COLORS[wx]} ${WUXING_COLORS[wx]}`}>{wx}</span>
            ))}
          </div>
        </div>
      )}

      {/* 逐项说明 */}
      {details.length > 0 && (
        <div className="mb-4">
          <h4 className="text-gold text-sm font-medium mb-2">{t.NAME_UI.detailsLabel}</h4>
          <div className="space-y-1.5">
            {details.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gold mt-0.5">•</span>
                <span className="text-text-secondary">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 建议 */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="text-gold text-sm font-medium mb-2">{t.NAME_UI.suggestionsLabel}</h4>
          <div className="space-y-1.5">
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gold mt-0.5">◆</span>
                <span className="text-text-secondary">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default BaziMatchSection
