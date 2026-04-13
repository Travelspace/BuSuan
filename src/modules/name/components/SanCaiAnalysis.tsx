import React from 'react'
import { Card } from '../../../components/common'
import type { NameResult } from '../../../types'
import { WUXING_COLORS, WUXING_BG_COLORS } from '../utils/constants'

interface SanCaiAnalysisProps {
  result: NameResult
}

const SanCaiAnalysis: React.FC<SanCaiAnalysisProps> = ({ result }) => {
  const { sanCai } = result

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

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">三才配置分析</h3>

      <div className="flex items-center justify-center gap-2 mb-6">
        <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.tian]}`}>
          <div className="text-text-muted text-xs">天格</div>
          <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.tian]}`}>{sanCai.tian}</div>
        </div>

        <div className="text-text-secondary text-sm">
          {relation12 === '生' ? '→生→' : relation12 === '克' ? '→克→' : relation12 === '比和' ? '→比和→' : '→'}
        </div>

        <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.ren]}`}>
          <div className="text-text-muted text-xs">人格</div>
          <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.ren]}`}>{sanCai.ren}</div>
        </div>

        <div className="text-text-secondary text-sm">
          {relation23 === '生' ? '→生→' : relation23 === '克' ? '→克→' : relation23 === '比和' ? '→比和→' : '→'}
        </div>

        <div className={`px-4 py-3 rounded-md text-center ${WUXING_BG_COLORS[sanCai.di]}`}>
          <div className="text-text-muted text-xs">地格</div>
          <div className={`text-xl font-serif ${WUXING_COLORS[sanCai.di]}`}>{sanCai.di}</div>
        </div>
      </div>

      <div className="bg-bg-primary/30 rounded-md p-4">
        <div className="text-text-secondary text-sm mb-2">
          <span className="text-gold">配置：</span>
          {sanCai.tian}{sanCai.ren}{sanCai.di}
        </div>
        <p className="text-text-primary text-sm leading-relaxed">{sanCai.relation}</p>
      </div>
    </Card>
  )
}

export default SanCaiAnalysis
