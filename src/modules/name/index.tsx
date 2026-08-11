import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'
import { calculateName } from './utils/calculation'
import { useTranslation } from '../../i18n'
import { Button } from '../../components/common'
import { RotateCcw } from 'lucide-react'
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
  const navigate = useNavigate()
  const [result, setResult] = useState<NameCalcResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fullName = birthInfo.name?.trim() ?? ''
  const showNonChineseHint = !isChineseName(fullName)

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

  // 未填写姓名：不展示表单，仅提供「前往填写」入口（参考运势分析页）
  if (!fullName) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">名</div>
          <p className="text-text-muted text-lg mb-4">{t.NAME_UI.goFillHint}</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            {t.NAME_UI.goFill}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gold mb-2">{t.MODULE_NAMES.name}</h2>
        <p className="text-text-secondary">{t.MODULE_DESCRIPTIONS.name}</p>
      </div>

      {result ? (
        <div className="animate-fade-in-up space-y-6">
          {/* 结果顶部工具条：姓名取自个人信息页，仅提供重算入口 */}
          <div className="flex items-center justify-end">
            <Button variant="secondary" size="sm" onClick={handleSubmit}>
              <RotateCcw size={14} className="mr-1.5" />
              {t.NAME_UI.reCalc}
            </Button>
          </div>

          <NameResult result={result} />
        </div>
      ) : (
        <div className="max-w-lg mx-auto space-y-6">
          {/* 姓名非纯汉字时提示 */}
          {showNonChineseHint && (
            <div className="bg-fire/10 border border-fire/30 rounded-md p-4">
              <p className="text-fire text-sm text-center">{t.NAME_UI.nonChineseNameHint}</p>
            </div>
          )}

          <NameForm
            name={fullName}
            onSubmit={handleSubmit}
            hasBazi={!!baziResult}
          />

          {error ? (
            <div className="text-center">
              <div className="text-5xl mb-3 opacity-20 text-fire">!</div>
              <p className="text-fire text-lg">{error}</p>
            </div>
          ) : (
            <div className="text-center pb-4">
              <div className="text-5xl mb-3 opacity-20">名</div>
              <p className="text-text-muted text-lg">{t.NAME_UI.emptyTitle}</p>
              <p className="text-text-secondary text-sm mt-2">{t.NAME_UI.emptyHint}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NameModule
