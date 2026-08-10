import React, { useState } from 'react'
import { Button, Card } from '../../../components/common'
import { tossCoins } from '../utils/calculation'
import { useTranslation } from '../../../i18n'

interface YaoGuaFormProps {
  onResult: (yaos: { type: '阳' | '阴'; isMoving: boolean }[], question: string) => void
  onTimeResult: (question: string) => void
  loading: boolean
}

const YaoGuaForm: React.FC<YaoGuaFormProps> = ({ onResult, onTimeResult, loading }) => {
  const t = useTranslation()
  const [mode, setMode] = useState<'manual' | 'time'>('manual')
  const [question, setQuestion] = useState('')
  const [yaoResults, setYaoResults] = useState<(null | { type: '阳' | '阴'; isMoving: boolean })[]>([
    null, null, null, null, null, null,
  ])
  const [isAutoTossing, setIsAutoTossing] = useState(false)

  const handleToss = (index: number) => {
    const result = tossCoins()
    const newResults = [...yaoResults]
    newResults[index] = result
    setYaoResults(newResults)
  }

  const handleAutoToss = async () => {
    setIsAutoTossing(true)
    const newResults: (null | { type: '阳' | '阴'; isMoving: boolean })[] = [
      null, null, null, null, null, null,
    ]

    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 300))
      newResults[i] = tossCoins()
      setYaoResults([...newResults])
    }

    setIsAutoTossing(false)
  }

  const handleManualSubmit = () => {
    if (yaoResults.some(r => r === null)) return
    onResult(yaoResults as { type: '阳' | '阴'; isMoving: boolean }[], question)
  }

  const handleTimeSubmit = () => {
    onTimeResult(question)
  }

  const allTossed = yaoResults.every(r => r !== null)

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.LIUYAO_UI.formTitle}</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('manual')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            mode === 'manual' ? 'bg-gold text-bg-primary' : 'bg-bg-primary/30 text-text-secondary hover:bg-gold/20'
          }`}
        >
          {t.LIUYAO_UI.manualMode}
        </button>
        <button
          onClick={() => setMode('time')}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            mode === 'time' ? 'bg-gold text-bg-primary' : 'bg-bg-primary/30 text-text-secondary hover:bg-gold/20'
          }`}
        >
          {t.LIUYAO_UI.timeMode}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-text-secondary text-sm mb-2">{t.LIUYAO_UI.questionLabel}</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.LIUYAO_UI.questionPlaceholder}
          className="w-full bg-bg-primary/50 border border-gold/20 rounded-md px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
        />
      </div>

      {mode === 'manual' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">{t.LIUYAO_UI.sixYaoTitle}</span>
            <Button size="sm" variant="secondary" onClick={handleAutoToss} disabled={isAutoTossing}>
              {isAutoTossing ? t.LIUYAO_UI.autoTossing : t.LIUYAO_UI.autoToss}
            </Button>
          </div>

          {t.YAO_POSITIONS.map(({ position, label }) => {
            const result = yaoResults[position - 1]
            return (
              <div key={position} className="flex items-center justify-between bg-bg-primary/30 rounded-md p-2.5">
                <span className="text-text-secondary text-sm">{label}</span>
                <div className="flex items-center gap-3">
                  {result ? (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${result.type === '阳' ? 'text-gold' : 'text-text-secondary'}`}>
                        {result.type === '阳' ? '━━━' : '━ ━'}
                      </span>
                      {result.isMoving && (
                        <span className="text-fire text-xs">{t.LIUYAO_UI.movingMark}</span>
                      )}
                      <span className={`text-xs ${result.type === '阳' ? 'text-gold' : 'text-text-muted'}`}>
                        {result.type}{t.LIUYAO_UI.yaoSuffix}{result.isMoving ? t.LIUYAO_UI.movingSuffix : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-text-muted text-xs">{t.LIUYAO_UI.notTossed}</span>
                  )}
                  <Button size="sm" onClick={() => handleToss(position - 1)} disabled={isAutoTossing}>
                    {t.LIUYAO_UI.tossBtn}
                  </Button>
                </div>
              </div>
            )
          })}

          <Button
            className="w-full mt-4"
            onClick={handleManualSubmit}
            loading={loading}
            disabled={!allTossed}
          >
            {t.LIUYAO_UI.submitBtn}
          </Button>
        </div>
      )}

      {mode === 'time' && (
        <div className="space-y-4">
          <div className="bg-bg-primary/30 rounded-md p-4">
            <p className="text-text-secondary text-sm mb-2">{t.LIUYAO_UI.timeMethodTitle}</p>
            <p className="text-text-muted text-xs leading-relaxed">
              {t.LIUYAO_UI.timeMethodDesc}
            </p>
          </div>
          <Button
            className="w-full"
            onClick={handleTimeSubmit}
            loading={loading}
          >
            {t.LIUYAO_UI.timeSubmitBtn}
          </Button>
        </div>
      )}
    </Card>
  )
}

export default YaoGuaForm
