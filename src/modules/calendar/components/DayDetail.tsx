import React from 'react'
import { Modal } from '../../../components/common'
import type { DayInfo } from '../utils/calculation'

interface DayDetailProps {
  day: DayInfo | null
  isOpen: boolean
  onClose: () => void
}

const DayDetail: React.FC<DayDetailProps> = ({ day, isOpen, onClose }) => {
  if (!day) return null

  const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${day.solar.month}月${day.solar.day}日 详情`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">公历</div>
            <div className="text-text-primary">
              {day.solar.year}年{day.solar.month}月{day.solar.day}日
            </div>
            <div className="text-text-secondary text-sm">{weekdayNames[day.weekday]}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">农历</div>
            <div className="text-text-primary">
              {day.lunar.monthStr}月{day.lunar.dayStr}
            </div>
            <div className="text-text-secondary text-sm">{day.shengXiao}年</div>
          </div>
        </div>

        <div className="bg-bg-primary/30 rounded-md p-3">
          <div className="text-text-muted text-xs mb-1">干支</div>
          <div className="flex gap-4">
            <div>
              <span className="text-text-secondary text-xs">年：</span>
              <span className="text-gold">{day.ganZhi.year}</span>
            </div>
            <div>
              <span className="text-text-secondary text-xs">月：</span>
              <span className="text-gold">{day.ganZhi.month}</span>
            </div>
            <div>
              <span className="text-text-secondary text-xs">日：</span>
              <span className="text-gold">{day.ganZhi.day}</span>
            </div>
          </div>
        </div>

        {day.jieQi && (
          <div className="bg-fire/10 border border-fire/20 rounded-md p-3">
            <span className="text-fire text-sm">🌿 节气：{day.jieQi}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-wood text-sm font-medium mb-2">✓ 宜</div>
            <div className="flex flex-wrap gap-1.5">
              {day.yi.length > 0 ? day.yi.map((y, i) => (
                <span key={i} className="px-2 py-0.5 bg-wood/10 text-wood text-xs rounded">
                  {y}
                </span>
              )) : (
                <span className="text-text-muted text-xs">无</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-fire text-sm font-medium mb-2">✗ 忌</div>
            <div className="flex flex-wrap gap-1.5">
              {day.ji.length > 0 ? day.ji.map((j, i) => (
                <span key={i} className="px-2 py-0.5 bg-fire/10 text-fire text-xs rounded">
                  {j}
                </span>
              )) : (
                <span className="text-text-muted text-xs">无</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">冲煞</div>
            <div className="text-text-primary text-sm">{day.chong} {day.sha}</div>
          </div>
          <div className="bg-bg-primary/30 rounded-md p-3">
            <div className="text-text-muted text-xs mb-1">吉神</div>
            <div className="text-wood text-sm">{day.jiShen.join('、') || '无'}</div>
          </div>
        </div>

        {day.baziRelation && (
          <div className={`rounded-md p-3 border ${
            day.baziRelation.score >= 55
              ? 'bg-wood/10 border-wood/20'
              : 'bg-fire/10 border-fire/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gold text-sm font-medium">八字匹配度</span>
              <span className={`text-lg font-serif ${
                day.baziRelation.score >= 75 ? 'text-wood' : day.baziRelation.score >= 55 ? 'text-gold' : 'text-fire'
              }`}>
                {day.baziRelation.score}分
              </span>
            </div>
            {day.baziRelation.heDesc && (
              <div className="text-wood text-xs mb-1">相合：{day.baziRelation.heDesc}</div>
            )}
            {day.baziRelation.chongDesc && (
              <div className="text-fire text-xs mb-1">相冲：{day.baziRelation.chongDesc}</div>
            )}
            {day.baziRelation.xingDesc && (
              <div className="text-fire text-xs mb-1">相刑：{day.baziRelation.xingDesc}</div>
            )}
            {day.baziRelation.haiDesc && (
              <div className="text-fire text-xs mb-1">相害：{day.baziRelation.haiDesc}</div>
            )}
            {day.baziRelation.ziXingDesc && (
              <div className="text-fire text-xs mb-1">自刑：{day.baziRelation.ziXingDesc}</div>
            )}
            <div className="text-text-secondary text-xs mt-2">{day.baziRelation.suggestion}</div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DayDetail
