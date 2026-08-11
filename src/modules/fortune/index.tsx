import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import { useAppStore } from '../../store'
import { calculateFortune } from './utils/calculation'
import { calculateZiweiFortune } from './utils/ziweiCalculation'
import { calculateZiwei, type ZiweiCalcResult } from '../ziwei/utils/calculation'
import BaziFortuneView from './components/BaziFortuneView'
import ZiweiFortuneView from './components/ZiweiFortuneView'
import { useTranslation } from '../../i18n'
import type { FortuneResult } from './utils/calculation'
import type { ZiweiFortuneResult } from './utils/ziweiCalculation'

type TabType = 'bazi' | 'ziwei'

const FortuneModule: React.FC = () => {
  const { birthInfo, baziResult, ziweiResult, setZiweiResult } = useAppStore()
  const navigate = useNavigate()
  const t = useTranslation()

  const [activeTab, setActiveTab] = useState<TabType>('bazi')
  const [baziFortune, setBaziFortune] = useState<FortuneResult | null>(null)
  const [ziweiFortune, setZiweiFortune] = useState<ZiweiFortuneResult | null>(null)
  const [loading, setLoading] = useState(false)

  const tabConfig = useMemo<{ key: TabType; label: string; desc: string }[]>(() => [
    { key: 'bazi', label: t.FORTUNE.tabBazi, desc: t.FORTUNE.baziDesc },
    { key: 'ziwei', label: t.FORTUNE.tabZiwei, desc: t.FORTUNE.ziweiDesc },
  ], [t])

  // 前往测算：跳转到尚无结果的排盘页；八字与紫微均无结果时跳八字页
  const handleGoCalc = useCallback(() => {
    if (!baziResult) {
      navigate('/bazi')
    } else if (!ziweiResult) {
      navigate('/ziwei')
    }
  }, [baziResult, ziweiResult, navigate])

  useEffect(() => {
    if (!birthInfo.date) return

    setLoading(true)
    try {
      if (activeTab === 'bazi' && baziResult) {
        const result = calculateFortune(birthInfo, baziResult)
        setBaziFortune(result)
      } else if (activeTab === 'ziwei') {
        let ziwei = ziweiResult as ZiweiCalcResult | null
        if (!ziwei) {
          ziwei = calculateZiwei(birthInfo)
          if (ziwei) setZiweiResult(ziwei as any)
        }
        if (ziwei) {
          const result = calculateZiweiFortune(ziwei, birthInfo)
          setZiweiFortune(result)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [activeTab, birthInfo, baziResult, ziweiResult, setZiweiResult])

  if (!birthInfo.date) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">运</div>
          <p className="text-text-muted text-lg mb-4">{t.FORTUNE.emptyNoBirthInfo}</p>
          <Button variant="secondary" onClick={handleGoCalc}>
            {t.FORTUNE.goCalc}
          </Button>
        </div>
      </div>
    )
  }

  if (activeTab === 'bazi' && !baziResult) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">运</div>
          <p className="text-text-muted text-lg mb-4">{t.FORTUNE.emptyNoBazi}</p>
          <Button variant="secondary" onClick={() => navigate('/bazi')}>
            {t.FORTUNE.goBazi}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.FORTUNE.title}</h2>
        <p className="text-text-secondary">{t.FORTUNE.subtitle}</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-button overflow-hidden border border-gold/20">
          {tabConfig.map((tab) => (
            <button
              key={tab.key}
              className={`px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gold text-bg-primary'
                  : 'bg-transparent text-text-secondary hover:text-gold'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-text-muted">
        {tabConfig.find(tab => tab.key === activeTab)?.desc}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-text-muted">{t.FORTUNE.loading}</p>
        </div>
      ) : (
        <>
          {activeTab === 'bazi' && baziFortune && (
            <BaziFortuneView result={baziFortune} />
          )}

          {activeTab === 'ziwei' && ziweiFortune && (
            <ZiweiFortuneView result={ziweiFortune} />
          )}
        </>
      )}
    </div>
  )
}

export default FortuneModule
