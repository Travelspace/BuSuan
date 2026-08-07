import React from 'react'
import FortuneCards from './FortuneCards'
import FortuneChart from './FortuneChart'
import KeyYears from './KeyYears'
import type { FortuneResult } from '../utils/calculation'

interface BaziFortuneViewProps {
  result: FortuneResult
}

const BaziFortuneView: React.FC<BaziFortuneViewProps> = ({ result }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <FortuneChart result={result} />
      <FortuneCards fortunes={result.fortunes} />
      <KeyYears fortunes={result.fortunes} />
    </div>
  )
}

export default BaziFortuneView
