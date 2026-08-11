import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../../../components/common'
import { getStrokeCount } from '../utils/strokeLookup'
import { useTranslation } from '../../../i18n'

interface NameFormProps {
  /** 来自个人信息页面的姓名 */
  name: string
  onSubmit: () => void
  loading?: boolean
  hasBazi: boolean
}

const NameForm: React.FC<NameFormProps> = ({ name, onSubmit, loading = false, hasBazi }) => {
  const t = useTranslation()
  const navigate = useNavigate()

  // 姓名为空：与八字排盘一致，仅展示「前往填写」入口，跳转个人信息页
  if (!name || name.trim().length === 0) {
    return (
      <Card hover={false}>
        <div className="text-center py-8">
          <p className="text-text-muted mb-4">{t.NAME_UI.goFillHint}</p>
          <Button variant="secondary" onClick={() => navigate('/profile')}>
            {t.NAME_UI.goFill}
          </Button>
        </div>
      </Card>
    )
  }

  const chars = [...name]
  const charStrokes = chars.map(c => ({ char: c, stroke: getStrokeCount(c) }))
  const hasUnknownStroke = charStrokes.some(cs => cs.stroke === null)
  const canTest = name.trim().length >= 2 && !hasUnknownStroke && hasBazi

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">{t.NAME_UI.inputTitle}</h3>

      {/* 姓名展示（取自个人信息页面，不可编辑） */}
      <div className="space-y-4">
        <div>
          <label className="block text-text-secondary text-sm mb-2">{t.NAME_UI.nameLabel}</label>
          <div className="w-full bg-bg-primary/50 border border-gold/20 rounded-md px-4 py-2.5 text-text-primary text-lg font-serif">
            {name}
          </div>
          <p className="text-text-muted text-xs mt-1">{t.NAME_UI.nameSourceHint}</p>
        </div>

        {chars.length > 0 && (
          <div className="bg-bg-primary/30 rounded-md p-3">
            <p className="text-text-secondary text-xs mb-2">{t.NAME_UI.kangxiStrokesLabel}</p>
            <div className="flex gap-3">
              {charStrokes.map((cs, i) => (
                <div key={i} className="text-center">
                  <div className="text-text-primary text-lg font-serif">{cs.char}</div>
                  <div className={`text-sm ${cs.stroke === null ? 'text-fire' : 'text-gold'}`}>
                    {cs.stroke === null ? t.NAME_UI.unknownStroke : `${cs.stroke}${t.NAME_UI.strokeSuffix}`}
                  </div>
                </div>
              ))}
            </div>
            {hasUnknownStroke && (
              <p className="text-fire text-xs mt-2">{t.NAME_UI.unknownStrokeWarn}</p>
            )}
          </div>
        )}

        {hasBazi && (
          <div className="bg-wood/10 border border-wood/20 rounded-md p-3">
            <p className="text-wood text-sm">{t.NAME_UI.hasBaziHint}</p>
          </div>
        )}

        {!hasBazi && (
          <div className="bg-gold/10 border border-gold/20 rounded-md p-3 space-y-3">
            <p className="text-gold/70 text-sm">{t.NAME_UI.noBaziHint}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate('/bazi')}
              className="w-full"
            >
              {t.NAME_UI.goBazi}
            </Button>
          </div>
        )}

        <Button
          type="button"
          loading={loading}
          disabled={!canTest}
          onClick={onSubmit}
          className="w-full"
        >
          {t.NAME_UI.startTest}
        </Button>
      </div>
    </Card>
  )
}

export default NameForm
