import { useState, useEffect } from 'react'

export function useAnimatedWidth(targetPercent: number, delay = 100): number {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(targetPercent)
    }, delay)
    return () => clearTimeout(timer)
  }, [targetPercent, delay])

  return width
}
