import React from 'react'
import { Card } from '../../../components/common'
import type { NameResult } from '../../../types'
import { GE_LEVEL_COLORS, GE_LEVEL_BG, WUXING_COLORS, WUXING_BG_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'

interface FiveGeDisplayProps {
  result: NameResult
}

const FiveGeDisplay: React.FC<FiveGeDisplayProps> = ({ result }) => {
  const t = useTranslation()
  const geList = [
    { key: 'tianGe' as const, label: t.NAME_UI.tianGe, desc: t.NAME_UI.tianGeDesc },
    { key: 'renGe' as const, label: t.NAME_UI.renGe, desc: t.NAME_UI.renGeDesc },
    { key: 'diGe' as const, label: t.NAME_UI.diGe, desc: t.NAME_UI.diGeDesc },
    { key: 'waiGe' as const, label: t.NAME_UI.waiGe, desc: t.NAME_UI.waiGeDesc },
    { key: 'zongGe' as const, label: t.NAME_UI.zongGe, desc: t.NAME_UI.zongGeDesc },
  ]

  const scoreInfo = t.SCORE_LEVEL_MAP[result.level]

  return (
    <div className="space-y-4">
      <Card hover={false}>
        <div className="text-center mb-6">
          <div className="text-text-muted text-sm mb-1">{t.NAME_UI.scoreLabel}</div>
          <div className={`text-5xl font-serif ${scoreInfo.color}`}>{result.score}</div>
          <div className={`text-lg ${scoreInfo.color}`}>{scoreInfo.label}</div>
        </div>

        <div className="w-full bg-bg-primary rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${result.score}%`,
              background: result.score >= 70
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : result.score >= 50
                  ? 'linear-gradient(90deg, #d4af37, #f4d03f)'
                  : 'linear-gradient(90deg, #e74c3c, #c0392b)',
            }}
          />
        </div>
        <div className="flex justify-between text-text-muted text-xs">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {geList.map(({ key, label, desc }) => {
          const ge = result.fiveGe[key]
          const meanings = t.GE_MEANINGS[ge.strokes]?.meanings || ge.meaning
          return (
            <Card key={key} hover={false} className="text-center">
              <div className="text-text-muted text-xs mb-1">{label}·{desc}</div>
              <div className={`text-3xl font-serif mb-1 ${GE_LEVEL_COLORS[ge.level]}`}>
                {ge.strokes}
              </div>
              <div className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${GE_LEVEL_BG[ge.level]} ${GE_LEVEL_COLORS[ge.level]}`}>
                {ge.level}
              </div>
              <div className={`inline-block px-2 py-0.5 rounded text-xs ml-1 ${WUXING_BG_COLORS[ge.wuXing]} ${WUXING_COLORS[ge.wuXing]}`}>
                {ge.wuXing}
              </div>
              <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                {meanings.join('、')}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default FiveGeDisplay
