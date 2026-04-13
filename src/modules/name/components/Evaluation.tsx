import React from 'react'
import { Card } from '../../../components/common'
import type { NameResult } from '../../../types'

interface EvaluationProps {
  result: NameResult
}

const Evaluation: React.FC<EvaluationProps> = ({ result }) => {
  const { evaluation } = result

  return (
    <Card hover={false}>
      <h3 className="text-lg font-serif text-gold mb-4">综合评价</h3>

      {evaluation.advantages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-wood text-sm font-medium mb-2">✓ 优点</h4>
          <div className="space-y-1.5">
            {evaluation.advantages.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-wood mt-0.5">•</span>
                <span className="text-text-secondary">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {evaluation.disadvantages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-fire text-sm font-medium mb-2">✗ 不足</h4>
          <div className="space-y-1.5">
            {evaluation.disadvantages.map((d, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-fire mt-0.5">•</span>
                <span className="text-text-secondary">{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {evaluation.suggestions.length > 0 && (
        <div>
          <h4 className="text-gold text-sm font-medium mb-2">◆ 建议</h4>
          <div className="space-y-1.5">
            {evaluation.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gold mt-0.5">•</span>
                <span className="text-text-secondary">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

export default Evaluation
