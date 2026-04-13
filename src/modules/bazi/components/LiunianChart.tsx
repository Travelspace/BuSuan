import React from 'react'
import { Card } from '../../../components/common'
import { GAN_WUXING, ZHI_WUXING, getWuXingBg } from '../utils/constants'
import type { Liunian } from '../../../types'

interface LiunianProps {
  liunian: Liunian[]
  dayMaster: string
}

const Liunian: React.FC<LiunianProps> = ({ liunian, dayMaster }) => {
  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">流年信息</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {liunian.map((ln, index) => {
          const ganWx = GAN_WUXING[ln.tianGan]
          const zhiWx = ZHI_WUXING[ln.diZhi]
          const isCurrentYear = ln.year === new Date().getFullYear()
          
          return (
            <div
              key={ln.year}
              className={`rounded-lg border p-3 text-center transition-all duration-300 ${
                isCurrentYear
                  ? 'border-gold bg-gold/10'
                  : 'border-gold/10 bg-bg-secondary/30 hover:border-gold/30'
              }`}
            >
              <div className="text-text-secondary text-sm mb-1">{ln.year}</div>
              
              <div className="flex justify-center gap-1 mb-1">
                <span className={`inline-block w-7 h-7 leading-7 rounded font-serif text-sm ${getWuXingBg(ganWx)}`}>
                  {ln.tianGan}
                </span>
                <span className={`inline-block w-7 h-7 leading-7 rounded font-serif text-sm ${getWuXingBg(zhiWx)}`}>
                  {ln.diZhi}
                </span>
              </div>
              
              <div className="text-text-muted text-xs">{ln.tenGod}</div>
              
              {isCurrentYear && (
                <div className="mt-1 text-xs text-gold">今年</div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default Liunian
