import React, { useState } from 'react'
import { Card, Modal } from '../../../components/common'
import type { GuaInfo, LiuyaoResult } from '../../../types'
import { LEVEL_LABELS } from '../utils/constants'

interface GuaInterpretationProps {
  result: LiuyaoResult
}

const GuaInterpretation: React.FC<GuaInterpretationProps> = ({ result }) => {
  const [selectedYao, setSelectedYao] = useState<number | null>(null)
  const [yaoModalOpen, setYaoModalOpen] = useState(false)

  const levelInfo = LEVEL_LABELS[result.interpretation.level]

  const handleYaoClick = (position: number) => {
    setSelectedYao(position)
    setYaoModalOpen(true)
  }

  const selectedYaoInfo = selectedYao ? result.benGua.yaoci.find(y => y.position === selectedYao) : null

  return (
    <div className="space-y-4">
      <Card hover={false}>
        <div className="text-center mb-4">
          <div className="text-text-muted text-sm mb-1">综合判断</div>
          <div className={`text-3xl font-serif ${levelInfo.color}`}>{levelInfo.label}</div>
        </div>

        <div className="bg-bg-primary/30 rounded-md p-4 mb-4">
          <div className="text-gold text-sm font-medium mb-2">卦象总论</div>
          <p className="text-text-primary text-sm leading-relaxed">{result.interpretation.summary}</p>
        </div>

        <div className="bg-bg-primary/30 rounded-md p-4">
          <div className="text-gold text-sm font-medium mb-2">建议</div>
          <p className="text-text-secondary text-sm leading-relaxed">{result.interpretation.advice}</p>
        </div>
      </Card>

      <Card hover={false}>
        <h4 className="text-gold font-serif mb-3">爻辞详情</h4>
        <div className="space-y-2">
          {result.benGua.yaoci.map(yao => (
            <div
              key={yao.position}
              className={`flex items-start gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${
                yao.isMoving ? 'bg-fire/10 border border-fire/20' : 'bg-bg-primary/30 hover:bg-gold/5'
              }`}
              onClick={() => handleYaoClick(yao.position)}
            >
              <span className={`text-sm font-medium w-12 shrink-0 ${
                yao.isMoving ? 'text-fire' : yao.type === '阳' ? 'text-gold' : 'text-text-secondary'
              }`}>
                {['初', '二', '三', '四', '五', '上'][yao.position - 1]}{yao.type === '阳' ? '九' : '六'}
                {yao.isMoving && ' 动'}
              </span>
              <span className="text-text-primary text-sm">{yao.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {result.benGua.guaciExplain && (
        <Card hover={false}>
          <h4 className="text-gold font-serif mb-3">卦辞详解</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{result.benGua.guaciExplain}</p>
        </Card>
      )}

      <Modal
        isOpen={yaoModalOpen}
        onClose={() => setYaoModalOpen(false)}
        title={selectedYaoInfo ? `${['初', '二', '三', '四', '五', '上'][selectedYaoInfo.position - 1]}${selectedYaoInfo.type === '阳' ? '九' : '六'}爻辞` : ''}
        size="md"
      >
        {selectedYaoInfo && (
          <div className="space-y-3">
            <div className="text-text-primary font-serif text-lg">{selectedYaoInfo.text}</div>
            <div className="text-text-secondary text-sm leading-relaxed">{selectedYaoInfo.explain}</div>
            {selectedYaoInfo.isMoving && (
              <div className="bg-fire/10 border border-fire/20 rounded-md p-3">
                <span className="text-fire text-sm">此为动爻，变化之所在，需特别关注</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GuaInterpretation
