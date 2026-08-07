import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import { useAppStore } from '../../store'
import { calculateFortune } from './utils/calculation'
import { calculateZiweiFortune } from './utils/ziweiCalculation'
import { calculateZiwei, type ZiweiCalcResult } from '../ziwei/utils/calculation'
import BaziFortuneView from './components/BaziFortuneView'
import ZiweiFortuneView from './components/ZiweiFortuneView'
import { FORTUNE } from '../../locales/zh-CN'
import type { FortuneResult } from './utils/calculation'
import type { ZiweiFortuneResult } from './utils/ziweiCalculation'

type TabType = 'bazi' | 'ziwei'

const TAB_CONFIG: { key: TabType; label: string; desc: string }[] = [
  { key: 'bazi', label: FORTUNE.tabBazi, desc: FORTUNE.baziDesc },
  { key: 'ziwei', label: FORTUNE.tabZiwei, desc: FORTUNE.ziweiDesc },
]

const FortuneModule: React.FC = () => {
  const { birthInfo, baziResult, ziweiResult, setZiweiResult } = useAppStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<TabType>('bazi')
  const [baziFortune, setBaziFortune] = useState<FortuneResult | null>(null)
  const [ziweiFortune, setZiweiFortune] = useState<ZiweiFortuneResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!birthInfo.date) return

    setLoading(true)
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
  }, [activeTab, birthInfo, baziResult, ziweiResult, setZiweiResult])

  if (!birthInfo.date) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">运</div>
          <p className="text-text-muted text-lg mb-4">{FORTUNE.emptyNoBirthInfo}</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            {FORTUNE.goFill}
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
          <p className="text-text-muted text-lg mb-4">{FORTUNE.emptyNoBazi}</p>
          <Button variant="secondary" onClick={() => navigate('/bazi')}>
            {FORTUNE.goBazi}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{FORTUNE.title}</h2>
        <p className="text-text-secondary">{FORTUNE.subtitle}</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-button overflow-hidden border border-gold/20">
          {TAB_CONFIG.map((tab) => (
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
        {TAB_CONFIG.find(tab => tab.key === activeTab)?.desc}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-text-muted">{FORTUNE.loading}</p>
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
