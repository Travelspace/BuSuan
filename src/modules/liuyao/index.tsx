import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateLiuyaoManual, calculateLiuyaoByTime } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { Button } from '../../components/common'
import { ChevronLeft, Dices } from 'lucide-react'
import YaoGuaForm from './components/YaoGuaForm'
import GuaDisplay from './components/GuaDisplay'
import GuaInterpretation from './components/GuaInterpretation'
import TiYongAnalysis from './components/TiYongAnalysis'
import type { LiuyaoResult } from '../../types'

const LiuyaoModule: React.FC = () => {
  const { setLiuyaoResult } = useAppStore()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LiuyaoResult | null>(null)
  // 排卦成功后表单向左折叠为竖条，点击展开
  const [collapsed, setCollapsed] = useState(false)

  const handleManualResult = useCallback((yaos: { type: '阳' | '阴'; isMoving: boolean }[], question: string) => {
    setLoading(true)
    const liuyaoResult = calculateLiuyaoManual(
      yaos.map((y, i) => ({
        position: i + 1,
        type: y.type,
        isMoving: y.isMoving,
        text: '',
        explain: '',
      })),
      question || undefined
    )
    setResult(liuyaoResult)
    if (liuyaoResult) {
      setLiuyaoResult(liuyaoResult)
      setCollapsed(true)
    }
    setLoading(false)
  }, [setLiuyaoResult])

  const handleTimeResult = useCallback((question: string) => {
    setLoading(true)
    const liuyaoResult = calculateLiuyaoByTime(question || undefined)
    setResult(liuyaoResult)
    if (liuyaoResult) {
      setLiuyaoResult(liuyaoResult)
      setCollapsed(true)
    }
    setLoading(false)
  }, [setLiuyaoResult])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.liuyao}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.liuyao}</p>
      </div>

      <div className="flex items-stretch gap-6">
        {collapsed ? (
          /* 折叠条：点击展开起卦表单 */
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
            aria-label={t.LIUYAO_UI.formTitle}
            className="group w-12 shrink-0 rounded-lg border border-gold/20 bg-bg-card hover:border-gold/50 hover:bg-gold/5 transition-colors flex flex-col items-center justify-center gap-2"
            title={t.LIUYAO_UI.formTitle}
          >
            <Dices size={18} className="text-gold/80 group-hover:text-gold transition-colors" />
            <span className="text-gold/80 group-hover:text-gold text-xs tracking-[0.25em] [writing-mode:vertical-rl]">
              {t.LIUYAO_UI.formTitle}
            </span>
          </button>
        ) : (
          <div className="w-full lg:w-1/3 shrink-0">
            {/* 展开态提供收起入口（仅在已有结果时显示，避免无结果误收起表单） */}
            {result && (
              <div className="flex justify-end mb-2">
                <Button variant="secondary" size="sm" onClick={() => setCollapsed(true)}>
                  <ChevronLeft size={14} className="mr-1" />
                  {t.LIUYAO_UI.collapseForm}
                </Button>
              </div>
            )}
            <YaoGuaForm
              onResult={handleManualResult}
              onTimeResult={handleTimeResult}
              loading={loading}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {result ? (
            <div className="animate-fade-in-up space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GuaDisplay
                  gua={result.benGua}
                  title={t.LIUYAO_UI.benGua}
                  dongYao={result.dongYao}
                  isActive={true}
                />
                {result.huGua && (
                  <GuaDisplay
                    gua={result.huGua}
                    title={t.LIUYAO_UI.huGua}
                    isActive={false}
                  />
                )}
                {result.bianGua && (
                  <GuaDisplay
                    gua={result.bianGua}
                    title={t.LIUYAO_UI.bianGua}
                    isActive={true}
                  />
                )}
              </div>

              <TiYongAnalysis result={result} />

              <GuaInterpretation result={result} />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-20">卦</div>
                <p className="text-text-muted text-lg">{t.LIUYAO_UI.emptyTitle}</p>
                <p className="text-text-secondary text-sm mt-2">{t.LIUYAO_UI.emptyHint}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiuyaoModule
