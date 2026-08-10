import React from 'react'
import { Card } from '../../../components/common'
import { getWuXingBg } from '../utils/constants'
import { GAN_WUXING } from '../../../utils/wuxing'
import { useTranslation } from '../../../i18n'
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
  const t = useTranslation()
  const positions = [t.BAZI_UI.yearPillar, t.BAZI_UI.monthPillar, t.BAZI_UI.dayPillar, t.BAZI_UI.hourPillar]
  const stemKeys = ['year', 'month', 'day', 'hour'] as const

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">{t.BAZI_UI.tenGodsTitle}</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-gold/10">
              <th className="py-2 text-text-muted text-sm font-normal">{t.BAZI_UI.tablePosition}</th>
              <th className="py-2 text-text-muted text-sm font-normal">{t.BAZI_UI.tableTianGan}</th>
              <th className="py-2 text-text-muted text-sm font-normal">{t.BAZI_UI.tableTenGod}</th>
              <th className="py-2 text-text-muted text-sm font-normal">{t.BAZI_UI.tableDiZhi}</th>
              <th className="py-2 text-text-muted text-sm font-normal">{t.BAZI_UI.tableHiddenStems}</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, i) => {
              const god = tenGods[i]
              const key = stemKeys[i]
              const hides = hiddenStems[key]
              const ganWx: WuXing = god?.tianGan ? GAN_WUXING[god.tianGan] : '土'
              const zhiWx: WuXing = god?.tianGan ? GAN_WUXING[god.tianGan] : '土'
              
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
