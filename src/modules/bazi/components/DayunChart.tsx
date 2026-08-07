import React from 'react'
import { Card } from '../../../components/common'
import { getWuXingBg } from '../utils/constants'
import { GAN_WUXING, ZHI_WUXING } from '../../../utils/wuxing'
import type { Dayun, Liunian, WuXing } from '../../../types'

interface DayunProps {
  dayun: Dayun[]
  currentAge?: number
}

const Dayun: React.FC<DayunProps> = ({ dayun, currentAge }) => {
  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">大运走势</h3>
      
      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-2">
          {dayun.map((dy, index) => {
            const ganWx = GAN_WUXING[dy.tianGan]
            const zhiWx = ZHI_WUXING[dy.diZhi]
            const isCurrent = currentAge && currentAge >= dy.startAge && currentAge <= dy.endAge
            
            return (
              <div
                key={index}
                className={`flex-shrink-0 w-20 rounded-lg border p-3 text-center transition-all duration-300 ${
                  isCurrent
                    ? 'border-gold bg-gold/10 shadow-card-hover'
                    : 'border-gold/10 bg-bg-secondary/30 hover:border-gold/30'
                }`}
              >
                <div className="text-text-muted text-xs mb-2">
                  {dy.startAge}-{dy.endAge}岁
                </div>
                
                <div className={`inline-block w-8 h-8 leading-8 rounded font-serif text-lg mb-1 ${getWuXingBg(ganWx)}`}>
                  {dy.tianGan}
                </div>
                <div className={`inline-block w-8 h-8 leading-8 rounded font-serif text-lg ${getWuXingBg(zhiWx)}`}>
                  {dy.diZhi}
                </div>
                
                {isCurrent && (
                  <div className="mt-2 text-xs text-gold">当前</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default Dayun
