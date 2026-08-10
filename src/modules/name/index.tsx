import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateName } from './utils/calculation'
import { useTranslation } from '../../i18n'
import NameForm from './components/NameForm'
import FiveGeDisplay from './components/FiveGeDisplay'
import SanCaiAnalysis from './components/SanCaiAnalysis'
import BaziMatch from './components/BaziMatch'
import Evaluation from './components/Evaluation'
import type { NameResult } from '../../types'

const NameModule: React.FC = () => {
  const { baziResult } = useAppStore()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<NameResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback((name: string) => {
    setLoading(true)
    setError(null)
    const nameResult = calculateName(name, baziResult)
    if (!nameResult) {
      setError(t.NAME_UI.errorUnknownStroke)
    }
    setResult(nameResult)
    setLoading(false)
  }, [baziResult, t])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.name}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.name}</p>
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

        {error && !result && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20 text-fire">!</div>
              <p className="text-fire text-lg">{error}</p>
            </div>
          </div>
        )}

        {!result && !error && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4 opacity-20">名</div>
              <p className="text-text-muted text-lg">{t.NAME_UI.emptyTitle}</p>
              <p className="text-text-secondary text-sm mt-2">{t.NAME_UI.emptyHint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NameModule
