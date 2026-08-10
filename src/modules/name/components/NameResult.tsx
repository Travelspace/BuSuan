/**
 * 姓名测算结果总入口
 * 布局顺序（自上而下）：
 *   1. 综合评分卡：总分 + 等级 + 姓名基本信息
 *   2. 八字匹配区（或八字缺失提示）
 *   3. 卦象分析区
 *   4. 五格参考区（折叠默认收起）
 */
import React from 'react'
import { Card } from '../../../components/common'
import type { NameCalcResult } from '../utils/types'
import BaziMatchSection from './BaziMatchSection'
import GuaAnalysisSection from './GuaAnalysisSection'
import WugeReferenceSection from './WugeReferenceSection'
import { useTranslation } from '../../../i18n'

interface NameResultProps {
  result: NameCalcResult
}

const NameResult: React.FC<NameResultProps> = ({ result }) => {
  const t = useTranslation()
  const scoreInfo = t.SCORE_LEVEL_MAP[result.level]
  const { overallScore, baziAnalysis, baziMissing, guaAnalysis, wugeReference, surname, givenName, name } = result

  return (
    <div className="space-y-6">
      {/* 1. 综合评分卡 */}
      <Card hover={false}>
        <div className="text-center mb-6">
          <div className="text-text-muted text-sm mb-1">{t.NAME_UI.overallCardTitle}</div>
          <div className={`text-5xl font-serif ${scoreInfo.color}`}>{overallScore}</div>
          <div className={`text-lg ${scoreInfo.color}`}>{scoreInfo.label}</div>
        </div>

        <div className="w-full bg-bg-primary rounded-full h-3 mb-2">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${overallScore}%`,
              background: overallScore >= 70
                ? 'linear-gradient(90deg, #27ae60, #2ecc71)'
                : overallScore >= 50
                  ? 'linear-gradient(90deg, #d4af37, #f4d03f)'
                  : 'linear-gradient(90deg, #e74c3c, #c0392b)',
            }}
          />
        </div>
        <div className="flex justify-between text-text-muted text-xs mb-4">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>

        {/* 姓名基本信息 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-bg-primary/30 rounded-md p-3 text-center">
            <div className="text-text-muted text-xs mb-1">{t.NAME_UI.surnameLabel}</div>
            <div className="text-lg font-serif text-text-primary">{surname}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3 text-center">
            <div className="text-text-muted text-xs mb-1">{t.NAME_UI.givenNameLabel}</div>
            <div className="text-lg font-serif text-text-primary">{givenName}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3 text-center">
            <div className="text-text-muted text-xs mb-1">{t.NAME_UI.fullNameLabel}</div>
            <div className="text-lg font-serif text-text-primary">{name}</div>
          </div>
        </div>
      </Card>

      {/* 2. 八字匹配区（或缺失提示） */}
      {baziAnalysis ? (
        <BaziMatchSection baziAnalysis={baziAnalysis} name={name} />
      ) : baziMissing ? (
        <Card hover={false}>
          <h3 className="text-lg font-serif text-gold mb-3">{t.NAME_UI.baziSectionTitle}</h3>
          <div className="bg-gold/10 border border-gold/20 rounded-md p-3">
            <p className="text-gold/80 text-sm leading-relaxed">{t.NAME_UI.baziMissingHint}</p>
          </div>
        </Card>
      ) : null}

      {/* 3. 卦象分析区 */}
      <GuaAnalysisSection guaAnalysis={guaAnalysis} />

      {/* 4. 五格参考区（折叠） */}
      <WugeReferenceSection wugeReference={wugeReference} />
    </div>
  )
}

export default NameResult
