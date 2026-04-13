import React, { useState } from 'react'
import { Button, Card } from '../../../components/common'
import { getStrokeCount } from '../utils/strokeLookup'

interface NameFormProps {
  onSubmit: (name: string) => void
  loading: boolean
  hasBazi: boolean
}

const NameForm: React.FC<NameFormProps> = ({ onSubmit, loading, hasBazi }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      onSubmit(name.trim())
    }
  }

  const chars = [...name]
  const charStrokes = chars.map(c => ({ char: c, stroke: getStrokeCount(c) }))

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">输入姓名</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-text-secondary text-sm mb-2">姓名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名（2-4个字）"
            maxLength={4}
            className="w-full bg-bg-primary/50 border border-gold/20 rounded-md px-4 py-2.5 text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
          />
          <p className="text-text-muted text-xs mt-1">支持单姓单名、单姓双名、复姓名字</p>
        </div>

        {chars.length > 0 && (
          <div className="bg-bg-primary/30 rounded-md p-3">
            <p className="text-text-secondary text-xs mb-2">康熙字典笔画：</p>
            <div className="flex gap-3">
              {charStrokes.map((cs, i) => (
                <div key={i} className="text-center">
                  <div className="text-text-primary text-lg font-serif">{cs.char}</div>
                  <div className="text-gold text-sm">{cs.stroke}画</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hasBazi && (
          <div className="bg-wood/10 border border-wood/20 rounded-md p-3">
            <p className="text-wood text-sm">✓ 已关联八字排盘数据，将进行八字匹配分析</p>
          </div>
        )}

        {!hasBazi && (
          <div className="bg-gold/10 border border-gold/20 rounded-md p-3">
            <p className="text-gold/70 text-sm">如需八字匹配分析，请先在八字排盘模块输入出生信息</p>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={name.trim().length < 2}
          className="w-full"
        >
          开始姓名测试
        </Button>
      </form>
    </Card>
  )
}

export default NameForm
