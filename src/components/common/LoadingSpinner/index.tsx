import React from 'react'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-2 border-gold/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border border-gold/10 rounded-full" />
        <div className="absolute inset-2 border border-gold/40 border-b-transparent rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gold font-serif text-lg animate-pulse">卜</span>
        </div>
      </div>
      <p className="text-text-muted text-sm animate-pulse">加载中...</p>
    </div>
  )
}

export default LoadingSpinner
