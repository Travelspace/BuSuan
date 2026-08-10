import React from 'react'
import { Card } from '../../../components/common'
import { useTranslation } from '../../../i18n'
import type { LiuyaoResult } from '../../../types'
import { TRIGRAM_WUXING } from '../../../utils/wuxing'

interface TiYongAnalysisProps {
  result: LiuyaoResult
}

const TiYongAnalysis: React.FC<TiYongAnalysisProps> = ({ result }) => {
  const t = useTranslation()
  const { tiYong } = result
  const tiWx = TRIGRAM_WUXING[tiYong.tiGua] || '土'
  const yongWx = TRIGRAM_WUXING[tiYong.yongGua] || '土'

  const relationDesc = t.TI_YONG_RELATIONS[tiYong.relation] || ''

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.LIUYAO_UI.tiYongTitle}</h3>

      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-text-muted text-xs mb-1">{t.LIUYAO_UI.tiGua}</div>
          <div className="text-2xl font-serif text-gold">{tiYong.tiGua}</div>
          <div className="text-text-secondary text-sm">{tiWx}</div>
        </div>

        <div className="text-center">
          <div className={`text-sm font-medium ${
            tiYong.relation === '比和' || tiYong.relation === '被生'
              ? 'text-wood'
              : tiYong.relation === '克' || tiYong.relation === '生'
                ? 'text-gold'
                : 'text-fire'
          }`}>
            {tiYong.relation}
          </div>
          <div className="text-text-muted text-xs">→</div>
        </div>

        <div className="text-center">
          <div className="text-text-muted text-xs mb-1">{t.LIUYAO_UI.yongGua}</div>
          <div className="text-2xl font-serif text-text-primary">{tiYong.yongGua}</div>
          <div className="text-text-secondary text-sm">{yongWx}</div>
        </div>
      </div>

      <div className={`rounded-md p-3 ${
        tiYong.isGood ? 'bg-wood/10 border border-wood/20' : 'bg-fire/10 border border-fire/20'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-sm font-medium ${tiYong.isGood ? 'text-wood' : 'text-fire'}`}>
            {tiYong.isGood ? t.LIUYAO_UI.good : t.LIUYAO_UI.bad}
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{relationDesc}</p>
      </div>

      {result.dongYao.length > 0 && (
        <div className="mt-3 bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-1">{t.LIUYAO_UI.dongYaoLabel}</div>
          <div className="text-text-primary text-sm">
            {result.dongYao.map(d => t.LIUYAO_UI.yaoPrefix[d - 1]).join('、')}{t.LIUYAO_UI.yaoSuffix}
          </div>
          <div className="text-text-muted text-xs mt-1">
            {t.LIUYAO_UI.dongYaoHint}
          </div>
        </div>
      )}
    </Card>
  )
}

export default TiYongAnalysis
