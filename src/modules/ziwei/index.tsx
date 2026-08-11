import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { calculateZiwei, type ZiweiCalcResult, type ZiweiPalaceData } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { BirthSummaryForm, Card, Button } from '../../components/common'
import { RotateCcw } from 'lucide-react'
import ZiweiChart from './components/ZiweiChart'
import PalaceDetail from './components/PalaceDetail'
import SihuaDisplay from './components/SihuaDisplay'
import type { BirthInfo } from '../../types'

const ZiweiModule: React.FC = () => {
  const { ziweiResult, setZiweiResult, birthInfo } = useAppStore()
  const t = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ZiweiCalcResult | null>(ziweiResult as ZiweiCalcResult | null)
  const [selectedPalace, setSelectedPalace] = useState<ZiweiPalaceData | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const handleSubmit = useCallback((info: BirthInfo) => {
    setLoading(true)
    const ziwei = calculateZiwei(info)
    setResult(ziwei)
    setZiweiResult(ziwei as any)
    setLoading(false)
  }, [setZiweiResult])

  // 出生信息只来自「信息填写」页，本页不可修改；重新测算 = 用最新 store 数据重算
  const handleRerun = useCallback(() => {
    handleSubmit(birthInfo)
  }, [handleSubmit, birthInfo])

  const handlePalaceClick = useCallback((palace: ZiweiPalaceData) => {
    setSelectedPalace(palace)
    setShowDetail(true)
  }, [])

  // 未填写出生信息：不展示表单，仅提供「前往填写」入口（参考运势分析页）
  if (!birthInfo.date) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">斗</div>
          <p className="text-text-muted text-lg mb-4">{t.BAZI_UI.goFillHint}</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            {t.BAZI_UI.goFill}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.ziwei}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.ziwei}</p>
      </div>

      {result ? (
        <div className="animate-fade-in-up space-y-6">
          {/* 结果顶部工具条：数据来自个人信息页，仅提供重算入口 */}
          <div className="flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={handleRerun} loading={loading}>
              <RotateCcw size={14} className="mr-1.5" />
              {t.ZIWEI_UI.reCalc}
            </Button>
          </div>

          <div className="space-y-6">
            <Card hover={false}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.solarLabel}</span>
                  <div className="text-text-primary">{result.solarDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.lunarLabel}</span>
                  <div className="text-text-primary">{result.lunarDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.ganZhiLabel}</span>
                  <div className="text-gold font-serif">{result.chineseDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.shichenLabel}</span>
                  <div className="text-text-primary">{result.time} ({result.timeRange})</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.zodiacLabel}</span>
                  <div className="text-text-primary">{result.zodiac}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.signLabel}</span>
                  <div className="text-text-primary">{result.sign}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.fiveElementsClassLabel}</span>
                  <div className="text-gold font-serif">{result.fiveElementsClass}</div>
                </div>
                <div>
                  <span className="text-text-muted">{t.ZIWEI_UI.soulLabel}</span>
                  <div className="text-gold font-serif">{result.soul}</div>
                </div>
              </div>
            </Card>

            <Card hover={false}>
              <h3 className="text-xl font-serif text-gold mb-4 text-center">{t.ZIWEI_UI.chartTitle}</h3>
              <ZiweiChart palaces={result.palaces} onPalaceClick={handlePalaceClick} />
            </Card>

            <SihuaDisplay result={result} />

            <PalaceDetail
              palace={selectedPalace}
              isOpen={showDetail}
              onClose={() => setShowDetail(false)}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-lg mx-auto space-y-8">
          <BirthSummaryForm
            onSubmit={handleSubmit}
            loading={loading}
            ganZhiLabel={t.ZIWEI_UI.ganZhiLabel}
            submitLabel={t.ZIWEI_UI.chartTitle}
          />

          <div className="text-center pb-4">
            <div className="text-5xl mb-3 opacity-20">斗</div>
            <p className="text-text-muted text-lg">{t.ZIWEI_UI.emptyTitle}</p>
            <p className="text-text-secondary text-sm mt-2">{t.ZIWEI_UI.emptyHint}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ZiweiModule
