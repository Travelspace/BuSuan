/**
 * 卦象分析展示区
 * 展示卦名、卦辞、上下卦、动爻、体用关系、卦象得分
 */
import React from 'react'
import type { TiYongRelation } from '../utils/types'
import type { GuaAnalysis } from '../utils/types'
import { Card } from '../../../components/common'
import { useTranslation } from '../../../i18n'

interface GuaAnalysisSectionProps {
  guaAnalysis: GuaAnalysis
}

/** 体用关系→颜色 */
const TI_YONG_COLOR: Record<TiYongRelation, string> = {
  '用生体': 'text-wood',
  '体克用': 'text-water',
  '比和': 'text-gold',
  '体生用': 'text-fire',
  '用克体': 'text-red-500',
}

const GuaAnalysisSection: React.FC<GuaAnalysisSectionProps> = ({ guaAnalysis }) => {
  const t = useTranslation()
  const { upperGua, lowerGua, dongYao, guaName, guaText, tiYong, tiYongDesc, score } = guaAnalysis

  const tiYongLabelMap: Record<TiYongRelation, string> = {
    '用生体': t.NAME_UI.tiYongShengTi,
    '体生用': t.NAME_UI.tiYongTiSheng,
    '体克用': t.NAME_UI.tiYongTiKe,
    '用克体': t.NAME_UI.tiYongYongKe,
    '比和': t.NAME_UI.tiYongBiHe,
  }

  const scoreColor = score >= 70 ? 'text-wood' : score >= 50 ? 'text-gold' : 'text-fire'

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.NAME_UI.guaSectionTitle}</h3>

      {/* 卦名大字 + 卦辞 */}
      <div className="text-center mb-6">
        <div className="text-4xl font-serif text-gold mb-2">{guaName}</div>
        <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
          {guaText}
        </p>
      </div>

      {/* 上下卦 / 动爻 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-bg-primary/30 rounded-md p-3 text-center">
          <div className="text-text-muted text-xs mb-1">{t.NAME_UI.upperGuaLabel}</div>
          <div className="text-xl font-serif text-text-primary">{upperGua}</div>
        </div>
        <div className="bg-bg-primary/30 rounded-md p-3 text-center">
          <div className="text-text-muted text-xs mb-1">{t.NAME_UI.lowerGuaLabel}</div>
          <div className="text-xl font-serif text-text-primary">{lowerGua}</div>
        </div>
        <div className="bg-bg-primary/30 rounded-md p-3 text-center">
          <div className="text-text-muted text-xs mb-1">{t.NAME_UI.dongYaoLabel}</div>
          <div className="text-xl font-serif text-text-primary">
            {dongYao}<span className="text-sm text-text-muted">{t.NAME_UI.dongYaoSuffix}</span>
          </div>
        </div>
      </div>

      {/* 体用关系 */}
      <div className="bg-bg-primary/30 rounded-md p-4 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-text-muted text-xs">{t.NAME_UI.tiYongLabel}</span>
          <span className={`px-2 py-0.5 rounded text-sm bg-bg-card ${TI_YONG_COLOR[tiYong]}`}>
            {tiYongLabelMap[tiYong]}
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{tiYongDesc}</p>
      </div>

      {/* 卦象得分 */}
      <div className="text-center">
        <div className="text-text-muted text-xs mb-1">{t.NAME_UI.guaScoreLabel}</div>
        <div className={`text-3xl font-serif ${scoreColor}`}>{score}</div>
      </div>
    </Card>
  )
}

export default GuaAnalysisSection
