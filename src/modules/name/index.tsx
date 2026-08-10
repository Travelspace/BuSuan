import React, { useState, useCallback } from 'react'
import { useAppStore } from '../../store'
import { calculateName } from './utils/calculation'
import { useTranslation } from '../../i18n'
import NameForm from './components/NameForm'
import NameResult from './components/NameResult'
import type { NameCalcResult } from './utils/types'

/** 按字数拆分姓氏与名字（与 wugeCalculation 单/复姓约定一致） */
function splitFullName(fullName: string): { surname: string; givenName: string } {
  const chars = [...fullName]
  if (chars.length === 2) return { surname: chars[0], givenName: chars[1] }
  if (chars.length === 3) return { surname: chars[0], givenName: chars.slice(1).join('') }
  if (chars.length === 4) return { surname: chars.slice(0, 2).join(''), givenName: chars.slice(2).join('') }
  return { surname: chars[0], givenName: chars.slice(1).join('') }
}

/** 判断是否为纯汉字姓名（空值视为通过，不触发提示） */
function isChineseName(name?: string): boolean {
  if (!name) return true
  return /^[\u4e00-\u9fff]+$/.test(name)
}

const NameModule: React.FC = () => {
  const { baziResult, birthInfo } = useAppStore()
  const t = useTranslation()
  const [result, setResult] = useState<NameCalcResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fullName = birthInfo.name?.trim() ?? ''
  const showNonChineseHint = !isChineseName(fullName)
  const isNameEmpty = fullName.length === 0

  const handleSubmit = useCallback(() => {
    if (fullName.length < 2) return
    setError(null)
    const { surname, givenName } = splitFullName(fullName)
    const nameResult = calculateName({ surname, givenName, baziResult })
    if (!nameResult) {
      setError(t.NAME_UI.errorUnknownStroke)
      return
    }
    setResult(nameResult)
  }, [fullName, baziResult, t])

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.name}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.name}</p>
      </div>

      {/* 姓名为空时提示去个人信息页面填写 */}
      {isNameEmpty && (
        <div className="bg-gold/10 border border-gold/30 rounded-md p-4">
          <p className="text-gold text-sm text-center">{t.NAME_UI.nameEmptyHint}</p>
        </div>
      )}

      {/* 姓名非纯汉字时提示 */}
      {showNonChineseHint && !isNameEmpty && (
        <div className="bg-fire/10 border border-fire/30 rounded-md p-4">
          <p className="text-fire text-sm text-center">{t.NAME_UI.nonChineseNameHint}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NameForm
            name={fullName}
            onSubmit={handleSubmit}
            hasBazi={!!baziResult}
          />
        </div>

        {result && (
          <div className="lg:col-span-2">
            <NameResult result={result} />
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
