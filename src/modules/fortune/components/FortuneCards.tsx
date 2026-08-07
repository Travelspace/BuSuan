import React, { useState } from 'react'
import { Card, Modal } from '../../../components/common'
import { LEVEL_COLORS, DIMENSION_LABELS, DIMENSION_ICONS } from '../utils/constants'
import { GAN_WUXING } from '../../../utils/wuxing'
import { getWuXingBg } from '../../bazi/utils/constants'
import { FORTUNE } from '../../../locales/zh-CN'
import type { YearFortune } from '../utils/calculation'

interface FortuneCardProps {
  fortune: YearFortune
  isCurrentYear?: boolean
}

const FortuneCard: React.FC<FortuneCardProps> = ({ fortune, isCurrentYear }) => {
  const [showDetail, setShowDetail] = useState(false)
  const colors = LEVEL_COLORS[fortune.level]

  return (
    <>
      <div
        className={`rounded-lg border p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
          isCurrentYear ? 'border-gold/40 bg-gold/5' : `${colors.border} ${colors.bg}`
        }`}
        onClick={() => setShowDetail(true)}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-primary font-medium">{fortune.year}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
            {fortune.level}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-block w-7 h-7 leading-7 rounded font-serif text-sm text-center ${getWuXingBg(GAN_WUXING[fortune.tianGan])}`}>
            {fortune.tianGan}
          </span>
          <span className="text-gold text-sm">{fortune.tenGod}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {fortune.tags.map((tag, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary">
              {tag}
            </span>
          ))}
        </div>

        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${fortune.score}%`,
              backgroundColor: fortune.score >= 65 ? '#27ae60' : fortune.score >= 45 ? '#d4af37' : '#e74c3c',
            }}
          />
        </div>

        <div className="text-right text-[10px] text-text-muted mt-1">{fortune.score}分</div>

        {isCurrentYear && (
          <div className="text-xs text-gold mt-2 text-center">{FORTUNE.currentYear}</div>
        )}
      </div>

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={`${fortune.year}年 ${fortune.ganZhi} ${FORTUNE.detailTitle}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`text-lg px-3 py-1 rounded border ${colors.bg} ${colors.text} ${colors.border}`}>
              {fortune.level}
            </span>
            <span className="text-text-secondary text-sm">{FORTUNE.scoreLabel}：{fortune.score}/100</span>
          </div>

          <p className="text-text-primary text-sm">{fortune.summary}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(['career', 'wealth', 'love', 'health'] as const).map((dim) => (
              <div key={dim} className="p-3 bg-bg-secondary/30 rounded-lg border border-gold/10">
                <div className="flex items-center gap-2 mb-1">
                  <span>{DIMENSION_ICONS[dim]}</span>
                  <span className="text-text-primary text-sm font-medium">{DIMENSION_LABELS[dim]}</span>
                </div>
                <p className="text-text-secondary text-xs">{fortune[dim]}</p>
              </div>
            ))}
          </div>

          {fortune.isKeyYear && fortune.keyReason && (
            <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
              <p className="text-gold text-sm">{FORTUNE.keyYearPrefix}：{fortune.keyReason}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

interface FortuneCardsProps {
  fortunes: YearFortune[]
}

const FortuneCards: React.FC<FortuneCardsProps> = ({ fortunes }) => {
  const currentYear = new Date().getFullYear()

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">{FORTUNE.decadesTitle}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {fortunes.map((f) => (
          <FortuneCard
            key={f.year}
            fortune={f}
            isCurrentYear={f.year === currentYear}
          />
        ))}
      </div>
    </Card>
  )
}

export default FortuneCards
