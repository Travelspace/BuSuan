import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateBazi } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { getAge } from '../../utils/date'
import BirthForm from './components/BirthForm'
import FourPillars from './components/FourPillars'
import TenGods from './components/TenGods'
import FiveElements from './components/FiveElements'
import DayunChart from './components/DayunChart'
import LiunianChart from './components/LiunianChart'
import type { BirthInfo, BaziResult } from '../../types'

const BaziModule: React.FC = () => {
  const { baziResult, setBaziResult, birthInfo } = useAppStore()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BaziResult | null>(baziResult)

  const handleSubmit = useCallback((info: BirthInfo) => {
    setLoading(true)
    const bazi = calculateBazi(info)
    setResult(bazi)
    setBaziResult(bazi)
    setLoading(false)
  }, [setBaziResult])

  const currentAge = birthInfo.date ? getAge(new Date(birthInfo.date)) : undefined

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.bazi}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.bazi}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BirthForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {result && (
          <div className="lg:col-span-2 space-y-6">
            <FourPillars
              pillars={result.pillars}
              tenGods={result.tenGods}
              dayMaster={result.dayMaster}
            />

            <TenGods
              tenGods={result.tenGods}
              hiddenStems={result.hiddenStems}
            />

            <FiveElements
              fiveElements={result.fiveElements}
              xiYongShen={result.xiYongShen}
            />

            <DayunChart
              dayun={result.dayun}
              currentAge={currentAge}
            />

            <LiunianChart
              liunian={result.liunian}
              dayMaster={result.dayMaster}
            />
          </div>
        )}

        {!result && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">卦</div>
              <p className="text-text-muted text-lg">{t.BAZI_UI.emptyTitle}</p>
              <p className="text-text-secondary text-sm mt-2">{t.BAZI_UI.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BaziModule
