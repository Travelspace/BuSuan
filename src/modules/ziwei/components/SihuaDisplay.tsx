import React from 'react'
import { Card } from '../../../components/common'
import { MUTAGEN_COLORS } from '../utils/constants'
import { useTranslation } from '../../../i18n'
import type { ZiweiCalcResult } from '../utils/calculation'

interface SihuaDisplayProps {
  result: ZiweiCalcResult
}

const SihuaDisplay: React.FC<SihuaDisplayProps> = ({ result }) => {
  const t = useTranslation()
  const items = [
    { key: '禄' as const, data: result.sihua.lu, label: t.ZIWEI_FORTUNE.sihuaLu.label, desc: t.ZIWEI_FORTUNE.sihuaLu.desc },
    { key: '权' as const, data: result.sihua.quan, label: t.ZIWEI_FORTUNE.sihuaQuan.label, desc: t.ZIWEI_FORTUNE.sihuaQuan.desc },
    { key: '科' as const, data: result.sihua.ke, label: t.ZIWEI_FORTUNE.sihuaKe.label, desc: t.ZIWEI_FORTUNE.sihuaKe.desc },
    { key: '忌' as const, data: result.sihua.ji, label: t.ZIWEI_FORTUNE.sihuaJi.label, desc: t.ZIWEI_FORTUNE.sihuaJi.desc },
  ]

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-4">{t.ZIWEI_UI.sihuaTitle}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ key, data, label, desc }) => {
          const palace = result.palaces.find(p => p.index === data.palace)
          const colorClass = MUTAGEN_COLORS[key] || ''

          return (
            <div
              key={key}
              className={`p-3 rounded-lg border ${colorClass} text-center`}
            >
              <div className="text-lg font-serif font-bold mb-1">{label}</div>
              <div className="text-sm font-medium">{data.star || '—'}</div>
              <div className="text-xs opacity-70 mt-1">
                {palace ? palace.name : '—'}
              </div>
              <div className="text-[10px] opacity-50 mt-0.5">{desc}</div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default SihuaDisplay
