import React from 'react'
import { Card } from '../../../components/common'
import { useTranslation } from '../../../i18n'
import type { GuaInfo, YaoInfo } from '../../../types'
import { TRIGRAM_WUXING } from '../utils/constants'

interface GuaDisplayProps {
  gua: GuaInfo
  title: string
  dongYao?: number[]
  isActive?: boolean
}

const YaoLine: React.FC<{ yao: YaoInfo; isDong?: boolean; onClick?: () => void }> = ({ yao, isDong, onClick }) => {
  const isYang = yao.type === '阳'

  return (
    <div
      className={`flex items-center justify-center py-1.5 cursor-pointer transition-colors ${
        isDong ? 'bg-fire/10' : 'hover:bg-gold/5'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1">
        {isYang ? (
          <div className="w-24 h-2 bg-gold/80 rounded-sm" />
        ) : (
          <div className="flex gap-2">
            <div className="w-10 h-2 bg-text-secondary/60 rounded-sm" />
            <div className="w-10 h-2 bg-text-secondary/60 rounded-sm" />
          </div>
        )}
        {isDong && (
          <span className="text-fire text-xs ml-2">○</span>
        )}
      </div>
    </div>
  )
}

const GuaDisplay: React.FC<GuaDisplayProps> = ({ gua, title, dongYao = [], isActive = true }) => {
  const t = useTranslation()
  const upperWx = TRIGRAM_WUXING[gua.upperTrigram] || '土'
  const lowerWx = TRIGRAM_WUXING[gua.lowerTrigram] || '土'

  return (
    <Card hover={false} className={!isActive ? 'opacity-60' : ''}>
      <div className="text-center mb-3">
        <h4 className="text-gold font-serif text-lg">{title}</h4>
        <div className="text-text-primary font-serif text-xl mt-1">{gua.fullName}</div>
        <div className="text-text-muted text-xs mt-1">
          {gua.symbol} · {gua.wuxing}{t.LIUYAO_UI.wuxingSuffix}
        </div>
      </div>

      <div className="bg-bg-primary/30 rounded-md p-3 mb-3">
        {[5, 4, 3].map(i => (
          <YaoLine key={i} yao={gua.yaoci[i]} isDong={dongYao.includes(i + 1)} />
        ))}
        <div className="border-t border-gold/10 my-1" />
        {[2, 1, 0].map(i => (
          <YaoLine key={i} yao={gua.yaoci[i]} isDong={dongYao.includes(i + 1)} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-bg-primary/30 rounded p-2">
          <div className="text-text-muted">{t.LIUYAO_UI.upperTrigram}</div>
          <div className="text-text-primary">{gua.upperTrigram}({upperWx})</div>
        </div>
        <div className="bg-bg-primary/30 rounded p-2">
          <div className="text-text-muted">{t.LIUYAO_UI.lowerTrigram}</div>
          <div className="text-text-primary">{gua.lowerTrigram}({lowerWx})</div>
        </div>
      </div>

      {isActive && gua.guaci && (
        <div className="mt-3 bg-bg-primary/30 rounded-md p-3">
          <div className="text-gold text-sm font-serif mb-1">{t.LIUYAO_UI.guaCiTitle}</div>
          <div className="text-text-primary text-sm">{gua.guaci}</div>
        </div>
      )}
    </Card>
  )
}

export default GuaDisplay
