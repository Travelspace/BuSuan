import React from 'react'
import { Card } from '../../../components/common'
import { GAN_WUXING, ZHI_WUXING, getWuXingBg } from '../utils/constants'
import type { TenGodRelation, TianGan, WuXing } from '../../../types'

interface TenGodsProps {
  tenGods: TenGodRelation[]
  hiddenStems: {
    year: { tianGan: TianGan; type: string }[]
    month: { tianGan: TianGan; type: string }[]
    day: { tianGan: TianGan; type: string }[]
    hour: { tianGan: TianGan; type: string }[]
  }
}

const TenGods: React.FC<TenGodsProps> = ({ tenGods, hiddenStems }) => {
  const positions = ['年柱', '月柱', '日柱', '时柱']
  const stemKeys = ['year', 'month', 'day', 'hour'] as const

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">十神与藏干</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="py-2 text-text-muted text-sm font-normal">位置</th>
              <th className="py-2 text-text-muted text-sm font-normal">天干</th>
              <th className="py-2 text-text-muted text-sm font-normal">十神</th>
              <th className="py-2 text-text-muted text-sm font-normal">地支</th>
              <th className="py-2 text-text-muted text-sm font-normal">藏干</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => {
              const god = tenGods[i]
              const key = stemKeys[i]
              const hides = hiddenStems[key]
              const ganWx: WuXing = god?.tianGan ? GAN_WUXING[god.tianGan] : '土'
              const zhiWx: WuXing = god?.tianGan ? ZHI_WUXING[god.tianGan] : '土'
              
              return (
                <tr key={pos} className="border-b border-gold/5">
                  <td className="py-3 text-text-secondary text-sm">{pos}</td>
                  <td className="py-3">
                    <span className={`inline-block w-8 h-8 leading-8 rounded font-serif text-lg ${getWuXingBg(ganWx)}`}>
                      {god?.tianGan}
                    </span>
                  </td>
                  <td className="py-3 text-gold text-sm">{god?.tenGod}</td>
                  <td className="py-3">
                    <span className={`inline-block w-8 h-8 leading-8 rounded font-serif text-lg ${getWuXingBg(zhiWx)}`}>
                      {god?.tianGan}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1 justify-center">
                      {hides?.map((h, j) => (
                        <span
                          key={j}
                          className={`inline-block px-1.5 py-0.5 rounded text-xs ${getWuXingBg(GAN_WUXING[h.tianGan])}`}
                        >
                          {h.tianGan}
                          <span className="text-text-muted ml-0.5">{h.type}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default TenGods
