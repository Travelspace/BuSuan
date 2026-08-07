import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateZiwei, type ZiweiCalcResult, type ZiweiPalaceData } from './utils/calculation'
import { MODULE_NAMES, MODULE_DESCRIPTIONS } from '../../utils/constants'
import ZiweiBirthForm from './components/ZiweiBirthForm'
import ZiweiChart from './components/ZiweiChart'
import PalaceDetail from './components/PalaceDetail'
import SihuaDisplay from './components/SihuaDisplay'
import { Card } from '../../components/common'
import type { BirthInfo } from '../../types'

const ZiweiModule: React.FC = () => {
  const { ziweiResult, setZiweiResult } = useAppStore()
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
        <h2 className="text-3xl font-serif text-gold mb-2">{MODULE_NAMES.ziwei}</h2>
        <p className="text-text-secondary">{MODULE_DESCRIPTIONS.ziwei}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ZiweiBirthForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {result && (
          <div className="lg:col-span-3 space-y-6">
            <Card hover={false}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <span className="text-text-muted">阳历</span>
                  <div className="text-text-primary">{result.solarDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">农历</span>
                  <div className="text-text-primary">{result.lunarDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">干支</span>
                  <div className="text-gold font-serif">{result.chineseDate}</div>
                </div>
                <div>
                  <span className="text-text-muted">时辰</span>
                  <div className="text-text-primary">{result.time} ({result.timeRange})</div>
                </div>
                <div>
                  <span className="text-text-muted">生肖</span>
                  <div className="text-text-primary">{result.zodiac}</div>
                </div>
                <div>
                  <span className="text-text-muted">星座</span>
                  <div className="text-text-primary">{result.sign}</div>
                </div>
                <div>
                  <span className="text-text-muted">五行局</span>
                  <div className="text-gold font-serif">{result.fiveElementsClass}</div>
                </div>
                <div>
                  <span className="text-text-muted">命主</span>
                  <div className="text-gold font-serif">{result.soul}</div>
                </div>
              </div>
            </Card>

            <Card hover={false}>
              <h3 className="text-xl font-serif text-gold mb-4 text-center">十二宫命盘</h3>
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
              <p className="text-text-muted text-lg">请输入出生信息排紫微命盘</p>
              <p className="text-text-secondary text-sm mt-2">支持公历和农历输入</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ZiweiModule
