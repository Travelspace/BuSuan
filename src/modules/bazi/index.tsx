import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { calculateBazi } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { getAge } from '../../utils/date'
import { BirthSummaryForm, Button } from '../../components/common'
import { RotateCcw } from 'lucide-react'
import FourPillars from './components/FourPillars'
import TenGods from './components/TenGods'
import FiveElements from './components/FiveElements'
import DayunChart from './components/DayunChart'
import LiunianChart from './components/LiunianChart'
import type { BirthInfo, BaziResult } from '../../types'

const BaziModule: React.FC = () => {
  const { baziResult, setBaziResult, birthInfo } = useAppStore()
  const t = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BaziResult | null>(baziResult)

  const handleSubmit = useCallback((info: BirthInfo) => {
    setLoading(true)
    const bazi = calculateBazi(info)
    setResult(bazi)
    setBaziResult(bazi)
    setLoading(false)
  }, [setBaziResult])

  // 出生信息只来自「信息填写」页，本页不可修改；重新测算 = 用最新 store 数据重算
  const handleRerun = useCallback(() => {
    handleSubmit(birthInfo)
  }, [handleSubmit, birthInfo])

  // 未填写出生信息：不展示表单，仅提供「前往填写」入口（参考运势分析页）
  if (!birthInfo.date) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">卦</div>
          <p className="text-text-muted text-lg mb-4">{t.BAZI_UI.goFillHint}</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            {t.BAZI_UI.goFill}
          </Button>
        </div>
      </div>
    )
  }

  const currentAge = getAge(new Date(birthInfo.date))

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.bazi}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.bazi}</p>
      </div>

      {result ? (
        <div className="animate-fade-in-up space-y-6">
          {/* 结果顶部工具条：数据来自个人信息页，仅提供重算入口 */}
          <div className="flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={handleRerun} loading={loading}>
              <RotateCcw size={14} className="mr-1.5" />
              {t.BAZI_UI.reCalc}
            </Button>
          </div>

          <div className="space-y-6">
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
        </div>
      ) : (
        <div className="max-w-lg mx-auto space-y-8">
          <BirthSummaryForm
            onSubmit={handleSubmit}
            loading={loading}
            ganZhiLabel={t.BAZI_UI.fourPillarsTitle}
            submitLabel={t.BAZI_UI.startCalc}
          />

          <div className="text-center pb-4">
            <div className="text-5xl mb-3 opacity-20">卦</div>
            <p className="text-text-muted text-lg">{t.BAZI_UI.emptyTitle}</p>
            <p className="text-text-secondary text-sm mt-2">{t.BAZI_UI.emptyHint}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BaziModule
