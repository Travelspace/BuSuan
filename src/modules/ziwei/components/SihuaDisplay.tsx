import React from 'react'
import { Card } from '../../../components/common'
import { SIHUA_LABELS, MUTAGEN_COLORS } from '../utils/constants'
import type { ZiweiCalcResult } from '../utils/calculation'

interface SihuaDisplayProps {
  result: ZiweiCalcResult
}

const SihuaDisplay: React.FC<SihuaDisplayProps> = ({ result }) => {
  const items = [
    { key: '禄' as const, data: result.sihua.lu },
    { key: '权' as const, data: result.sihua.quan },
    { key: '科' as const, data: result.sihua.ke },
    { key: '忌' as const, data: result.sihua.ji },
  ]

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-4">四化飞星</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ key, data }) => {
          const palace = result.palaces.find(p => p.index === data.palace)
          const colorClass = MUTAGEN_COLORS[key] || ''

          return (
            <div
              key={key}
              className={`p-3 rounded-lg border ${colorClass} text-center`}
            >
              <div className="text-lg font-serif font-bold mb-1">化{key}</div>
              <div className="text-sm font-medium">{data.star || '—'}</div>
              <div className="text-xs opacity-70 mt-1">
                {palace ? palace.name : '—'}
              </div>
              <div className="text-[10px] opacity-50 mt-0.5">
                {SIHUA_LABELS[key]?.split('—')[0] || ''}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default SihuaDisplay
