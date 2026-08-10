/**
 * 五格参考展示区（折叠默认收起）
 * 改造自原 FiveGeDisplay + SanCaiAnalysis，合并为折叠参考区，标注"参考信息"
 */
import React, { useState } from 'react'
import { Card } from '../../../components/common'
import type { WugeReference } from '../utils/types'
import {
  GE_LEVEL_COLORS,
  GE_LEVEL_BG,
  WUXING_COLORS,
  WUXING_BG_COLORS,
} from '../utils/constants'
import { useTranslation } from '../../../i18n'

interface WugeReferenceSectionProps {
  wugeReference: WugeReference
}

const WugeReferenceSection: React.FC<WugeReferenceSectionProps> = ({ wugeReference }) => {
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const geList = [
    { key: 'tianGe' as const, label: t.NAME_UI.tianGe, desc: t.NAME_UI.tianGeDesc },
    { key: 'renGe' as const, label: t.NAME_UI.renGe, desc: t.NAME_UI.renGeDesc },
    { key: 'diGe' as const, label: t.NAME_UI.diGe, desc: t.NAME_UI.diGeDesc },
    { key: 'waiGe' as const, label: t.NAME_UI.waiGe, desc: t.NAME_UI.waiGeDesc },
    { key: 'zongGe' as const, label: t.NAME_UI.zongGe, desc: t.NAME_UI.zongGeDesc },
  ]

  const { sanCai, score } = wugeReference
  const sanCaiKey = `${sanCai.tian}${sanCai.ren}${sanCai.di}`
  const sanCaiRelation = t.SANCAI_RELATIONS[sanCaiKey] || sanCai.relation

  // 三才两两关系
  const shengMap: Record<string, string> = {
    '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
  }
  const keMap: Record<string, string> = {
    '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
  }
  function getRelation(from: string, to: string): string {
    if (from === to) return '比和'
    if (shengMap[from] === to) return '生'
    if (keMap[from] === to) return '克'
    if (shengMap[to] === from) return '被生'
    if (keMap[to] === from) return '被克'
    return ''
  }
  const relation12 = getRelation(sanCai.tian, sanCai.ren)
  const relation23 = getRelation(sanCai.ren, sanCai.di)

  const scoreColor = score >= 70 ? 'text-wood' : score >= 50 ? 'text-gold' : 'text-fire'

  return (
    <Card hover={false}>
      {/* 标题行：折叠控制 + 参考信息徽章 */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-2 text-lg font-serif text-gold focus:outline-none"
          aria-expanded={expanded}
        >
          <span className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>▶</span>
          {t.NAME_UI.wugeSectionTitle}
        </button>
        <span className="px-2 py-0.5 rounded text-xs bg-gold/15 text-gold/80">
          {t.NAME_UI.wugeReferenceBadge}
        </span>
      </div>

      {/* 五格得分（始终展示） */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-text-muted text-xs">{t.NAME_UI.wugeScoreLabel}</span>
        <span className={`text-xl font-serif ${scoreColor}`}>{score}</span>
      </div>

      {!expanded && (
        <p className="text-text-muted text-xs">{t.NAME_UI.wugeCollapsedHint}</p>
      )}

      {expanded && (
        <div className="space-y-4 mt-2">
          {/* 五格数理 */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {geList.map(({ key, label, desc }) => {
              const ge = wugeReference[key]
              const meanings = t.GE_MEANINGS[ge.strokes]?.meanings || ge.meaning
              return (
                <div key={key} className="bg-bg-primary/30 rounded-md p-3 text-center">
                  <div className="text-text-muted text-xs mb-1">{label}·{desc}</div>
                  <div className={`text-3xl font-serif mb-1 ${GE_LEVEL_COLORS[ge.level]}`}>
                    {ge.strokes}
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded text-xs mb-2 ${GE_LEVEL_BG[ge.level]} ${GE_LEVEL_COLORS[ge.level]}`}>
                    {ge.level}
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded text-xs ml-1 ${WUXING_BG_COLORS[ge.wuXing]} ${WUXING_COLORS[ge.wuXing]}`}>
                    {ge.wuXing}
                  </div>
                  <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {meanings.join('、')}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 三才配置 */}
          <div className="bg-bg-primary/30 rounded-md p-4">
            <h4 className="text-gold text-sm font-medium mb-3">{t.NAME_UI.sanCaiTitle}</h4>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.tian]}`}>
                <div className="text-text-muted text-xs">{t.NAME_UI.tianGe}</div>
                <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.tian]}`}>{sanCai.tian}</div>
              </div>
              <div className="text-text-secondary text-sm">→{relation12}→</div>
              <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.ren]}`}>
                <div className="text-text-muted text-xs">{t.NAME_UI.renGe}</div>
                <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.ren]}`}>{sanCai.ren}</div>
              </div>
              <div className="text-text-secondary text-sm">→{relation23}→</div>
              <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.di]}`}>
                <div className="text-text-muted text-xs">{t.NAME_UI.diGe}</div>
                <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.di]}`}>{sanCai.di}</div>
              </div>
            </div>
            <div className="text-text-secondary text-sm mb-2">
              <span className="text-gold">{t.NAME_UI.sanCaiConfigLabel}</span>
              {sanCai.tian}{sanCai.ren}{sanCai.di}
            </div>
            <p className="text-text-primary text-sm leading-relaxed">{sanCaiRelation}</p>
          </div>
        </div>
      )}
    </Card>
  )
}

export default WugeReferenceSection
