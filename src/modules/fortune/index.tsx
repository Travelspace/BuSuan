import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../../components/common'
import { useAppStore } from '../../store'
import { calculateFortune } from './utils/calculation'
import { calculateZiweiFortune } from './utils/ziweiCalculation'
import FortuneCards from './components/FortuneCards'
import FortuneChart from './components/FortuneChart'
import ZiweiFortuneView from './components/ZiweiFortuneView'
import type { FortuneResult } from './utils/calculation'
import type { ZiweiFortuneResult } from './utils/ziweiCalculation'

type TabType = 'bazi' | 'ziwei'

const FortuneModule: React.FC = () => {
  const { birthInfo, baziResult } = useAppStore()
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
      const result = calculateZiweiFortune(birthInfo)
      setZiweiFortune(result)
    }
    setLoading(false)
  }, [activeTab, birthInfo, baziResult])

  if (!birthInfo.date) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">运</div>
          <p className="text-text-muted text-lg mb-4">请先在「信息填写」模块中录入出生信息</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            前往填写
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
          <p className="text-text-muted text-lg mb-4">请先完成八字排盘以获取运势分析</p>
          <Button variant="secondary" onClick={() => navigate('/bazi')}>
            前往排盘
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">运势分析</h2>
        <p className="text-text-secondary">基于八字与紫微斗数的运势预测</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-button overflow-hidden border border-gold/20">
          <button
            className={`px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeTab === 'bazi'
                ? 'bg-gold text-bg-primary'
                : 'bg-transparent text-text-secondary hover:text-gold'
            }`}
            onClick={() => setActiveTab('bazi')}
          >
            八字排盘
          </button>
          <button
            className={`px-8 py-2.5 text-sm font-medium transition-all duration-300 ${
              activeTab === 'ziwei'
                ? 'bg-gold text-bg-primary'
                : 'bg-transparent text-text-secondary hover:text-gold'
            }`}
            onClick={() => setActiveTab('ziwei')}
          >
            紫微斗数
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-text-muted">
        {activeTab === 'bazi'
          ? '八字：宏观人生蓝图，描绘大趋势、格局高低、运势起伏'
          : '紫微斗数：微观高清地图，十二宫位精细分析各领域运势'}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-text-muted">正在计算运势...</p>
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'bazi' && baziFortune && (
            <div className="space-y-6">
              <FortuneChart result={baziFortune} />
              <FortuneCards fortunes={baziFortune.fortunes} />

              <Card hover={false}>
                <h3 className="text-xl font-serif text-gold mb-4">关键年份提醒</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {baziFortune.fortunes
                    .filter(f => f.isKeyYear)
                    .map(f => (
                      <div
                        key={f.year}
                        className={`p-3 rounded-lg border ${
                          f.score >= 65
                            ? 'bg-wood/5 border-wood/20'
                            : f.score >= 45
                            ? 'bg-gold/5 border-gold/20'
                            : 'bg-fire/5 border-fire/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-text-primary font-medium">{f.year}年 {f.ganZhi}</span>
                          <span className="text-xs text-text-muted">{f.score}分</span>
                        </div>
                        {f.keyReason && (
                          <p className="text-text-secondary text-xs">{f.keyReason}</p>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'ziwei' && ziweiFortune && (
            <ZiweiFortuneView result={ziweiFortune} />
          )}
        </div>
      )}
    </div>
  )
}

export default FortuneModule
