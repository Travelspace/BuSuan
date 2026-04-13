import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateLiuyaoManual, calculateLiuyaoByTime } from './utils/calculation'
import { MODULE_NAMES, MODULE_DESCRIPTIONS } from '../../utils/constants'
import YaoGuaForm from './components/YaoGuaForm'
import GuaDisplay from './components/GuaDisplay'
import GuaInterpretation from './components/GuaInterpretation'
import TiYongAnalysis from './components/TiYongAnalysis'
import type { LiuyaoResult } from '../../types'

const LiuyaoModule: React.FC = () => {
  const { setLiuyaoResult } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LiuyaoResult | null>(null)

  const handleManualResult = useCallback((yaos: { type: '阳' | '阴'; isMoving: boolean }[], question: string) => {
    setLoading(true)
    setTimeout(() => {
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
      if (liuyaoResult) setLiuyaoResult(liuyaoResult)
      setLoading(false)
    }, 300)
  }, [setLiuyaoResult])

  const handleTimeResult = useCallback((question: string) => {
    setLoading(true)
    setTimeout(() => {
      const liuyaoResult = calculateLiuyaoByTime(question || undefined)
      setResult(liuyaoResult)
      if (liuyaoResult) setLiuyaoResult(liuyaoResult)
      setLoading(false)
    }, 300)
  }, [setLiuyaoResult])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{MODULE_NAMES.liuyao}</h2>
        <p className="text-text-secondary">{MODULE_DESCRIPTIONS.liuyao}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <YaoGuaForm
            onResult={handleManualResult}
            onTimeResult={handleTimeResult}
            loading={loading}
          />
        </div>

        {result && (
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GuaDisplay
                gua={result.benGua}
                title="本卦"
                dongYao={result.dongYao}
                isActive={true}
              />
              {result.huGua && (
                <GuaDisplay
                  gua={result.huGua}
                  title="互卦"
                  isActive={false}
                />
              )}
              {result.bianGua && (
                <GuaDisplay
                  gua={result.bianGua}
                  title="变卦"
                  isActive={true}
                />
              )}
            </div>

            <TiYongAnalysis result={result} />

            <GuaInterpretation result={result} />
          </div>
        )}

        {!result && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">卦</div>
              <p className="text-text-muted text-lg">请选择起卦方式开始占卜</p>
              <p className="text-text-secondary text-sm mt-2">支持手动摇卦和时间起卦</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiuyaoModule
