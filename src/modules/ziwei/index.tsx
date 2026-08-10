import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateZiwei, type ZiweiCalcResult, type ZiweiPalaceData } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { BirthSummaryForm, Card } from '../../components/common'
import ZiweiChart from './components/ZiweiChart'
import PalaceDetail from './components/PalaceDetail'
import SihuaDisplay from './components/SihuaDisplay'
import type { BirthInfo } from '../../types'

const ZiweiModule: React.FC = () => {
  const { ziweiResult, setZiweiResult } = useAppStore()
  const t = useTranslation()
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

  const handlePalaceClick = useCallback((palace: ZiweiPalaceData) => {
    setSelectedPalace(palace)
    setShowDetail(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.ziwei}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.ziwei}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <BirthSummaryForm
            onSubmit={handleSubmit}
            loading={loading}
            ganZhiLabel={t.ZIWEI_UI.ganZhiLabel}
            submitLabel={t.ZIWEI_UI.chartTitle}
          />
        </div>

        {result && (
          <div className="lg:col-span-3 space-y-6">
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
        )}

        {!result && (
          <div className="lg:col-span-3 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">斗</div>
              <p className="text-text-muted text-lg">{t.ZIWEI_UI.emptyTitle}</p>
              <p className="text-text-secondary text-sm mt-2">{t.ZIWEI_UI.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ZiweiModule
