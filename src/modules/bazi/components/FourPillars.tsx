import React from 'react'
import { Card } from '../../../components/common'
import { ZHI_SHENGXIAO, getWuXingBg } from '../utils/constants'
import { GAN_WUXING, ZHI_WUXING } from '../../../utils/wuxing'
import type { Pillar, WuXing } from '../../../types'

interface PillarCardProps {
  label: string
  pillar: Pillar
  tenGod?: string
}

const PillarCard: React.FC<PillarCardProps> = ({ label, pillar, tenGod }) => {
  const ganWx = GAN_WUXING[pillar.tianGan]
  const zhiWx = ZHI_WUXING[pillar.diZhi]
  const shengXiao = ZHI_SHENGXIAO[pillar.diZhi]

  return (
    <div className="flex flex-col items-center">
      <div className="text-text-muted text-xs mb-1">{label}</div>
      {tenGod && (
        <div className="text-xs text-gold/70 mb-2">{tenGod}</div>
      )}
      
      <div className="bg-bg-secondary/50 rounded-lg border border-gold/10 overflow-hidden w-20">
        <div className={`py-3 text-center border-b border-gold/10 ${getWuXingBg(ganWx)}`}>
          <span className="text-2xl font-serif">{pillar.tianGan}</span>
        </div>
        <div className={`py-3 text-center ${getWuXingBg(zhiWx)}`}>
          <span className="text-2xl font-serif">{pillar.diZhi}</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-text-muted text-center space-y-0.5">
        <div>{shengXiao}</div>
        <div className="text-gold/60">{pillar.nayin}</div>
      </div>
    </div>
  )
}

interface FourPillarsProps {
  pillars: {
    year: Pillar
    month: Pillar
    day: Pillar
    hour: Pillar
  }
  tenGods: { position: string; tenGod: string }[]
  dayMaster: string
}

const FourPillars: React.FC<FourPillarsProps> = ({ pillars, tenGods, dayMaster }) => {
  const pillarData = [
    { label: '年柱', pillar: pillars.year, tenGod: tenGods[0]?.tenGod },
    { label: '月柱', pillar: pillars.month, tenGod: tenGods[1]?.tenGod },
    { label: '日柱', pillar: pillars.day, tenGod: '日主' },
    { label: '时柱', pillar: pillars.hour, tenGod: tenGods[3]?.tenGod },
  ]

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">四柱八字</h3>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-sm text-text-secondary">
          日主：<span className="text-gold font-serif text-lg">{dayMaster}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
        {pillarData.map((item) => (
          <PillarCard
            key={item.label}
            label={item.label}
            pillar={item.pillar}
            tenGod={item.tenGod}
          />
        ))}
      </div>
    </Card>
  )
}

export default FourPillars
