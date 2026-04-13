import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateName } from './utils/calculation'
import { MODULE_NAMES, MODULE_DESCRIPTIONS } from '../../utils/constants'
import NameForm from './components/NameForm'
import FiveGeDisplay from './components/FiveGeDisplay'
import SanCaiAnalysis from './components/SanCaiAnalysis'
import BaziMatch from './components/BaziMatch'
import Evaluation from './components/Evaluation'
import type { NameResult } from '../../types'

const NameModule: React.FC = () => {
  const { baziResult } = useAppStore()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NameResult | null>(null)

  const handleSubmit = useCallback((name: string) => {
    setLoading(true)
    setTimeout(() => {
      const nameResult = calculateName(name, baziResult)
      setResult(nameResult)
      setLoading(false)
    }, 300)
  }, [baziResult])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{MODULE_NAMES.name}</h2>
        <p className="text-text-secondary">{MODULE_DESCRIPTIONS.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NameForm
            onSubmit={handleSubmit}
            loading={loading}
            hasBazi={!!baziResult}
          />
        </div>

        {result && (
          <div className="lg:col-span-2 space-y-6">
            <FiveGeDisplay result={result} />
            <SanCaiAnalysis result={result} />
            {result.baziMatch && <BaziMatch result={result} />}
            <Evaluation result={result} />
          </div>
        )}

        {!result && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">名</div>
              <p className="text-text-muted text-lg">请输入姓名开始测试</p>
              <p className="text-text-secondary text-sm mt-2">基于康熙字典笔画计算五格数理</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NameModule
