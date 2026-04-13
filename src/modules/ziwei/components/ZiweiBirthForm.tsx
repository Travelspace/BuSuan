import React from 'react'
import { Button, Card } from '../../../components/common'
import { useAppStore } from '../../../store'
import { SHICHEN_MAP } from '../../bazi/utils/constants'
import { dateToBazi } from '../../bazi/utils/calculation'
import type { BirthInfo } from '../../../types'

interface ZiweiBirthFormProps {
  onSubmit: (birthInfo: BirthInfo) => void
  loading?: boolean
}

const ZiweiBirthForm: React.FC<ZiweiBirthFormProps> = ({ onSubmit, loading = false }) => {
  const { birthInfo } = useAppStore()

  const hasInfo = !!birthInfo.date

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasInfo) return
    onSubmit(birthInfo)
  }

  if (!hasInfo) {
    return (
      <Card hover={false}>
        <div className="text-center py-8">
          <p className="text-text-muted mb-4">请先在「信息填写」模块中录入出生信息</p>
          <Button variant="secondary" onClick={() => window.location.href = '/profile'}>
            前往填写
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card hover={false}>
      <h3 className="text-xl font-serif text-gold mb-6">出生信息</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          {birthInfo.name && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">姓名</span>
              <span className="text-text-primary">{birthInfo.name}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">性别</span>
            <span className="text-text-primary">{birthInfo.gender === 'male' ? '男' : '女'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">日历类型</span>
            <span className="text-text-primary">{birthInfo.calendar === 'solar' ? '公历' : '农历'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">生辰八字</span>
            <span className="text-text-primary">{dateToBazi(birthInfo.date, birthInfo.calendar)}</span>
          </div>
          {birthInfo.location && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">出生地点</span>
              <span className="text-text-primary">{birthInfo.location}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button type="submit" loading={loading} className="w-full">
            排紫微命盘
          </Button>
        </div>

        <div className="border-t border-gold/10 pt-4">
          <p className="text-text-muted text-xs mb-2">时辰对照表：</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {SHICHEN_MAP.map((item) => (
              <div
                key={item.index}
                className="text-xs text-text-secondary bg-bg-secondary/30 rounded px-2 py-1 flex justify-between"
              >
                <span>{item.label}</span>
                <span className="text-text-muted">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Card>
  )
}

export default ZiweiBirthForm
