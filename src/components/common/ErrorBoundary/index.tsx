import React from 'react'
import Button from '../Button'
import Card from '../Card'
import { COMMON } from '../../../locales/zh-CN'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  resetKey: number
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, resetKey: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  private isChunkLoadError(error: Error | null): boolean {
    if (!error) return false
    const message = error.message.toLowerCase()
    return (
      error.name === 'ChunkLoadError' ||
      message.includes('loading chunk') ||
      message.includes('load chunk') ||
      message.includes('loading css chunk')
    )
  }

  handleReset = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      resetKey: prevState.resetKey + 1,
    }))
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.isChunkLoadError(this.state.error)
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card hover={false} className="max-w-md w-full text-center">
            <div className="text-6xl mb-4 opacity-30">⚠</div>
            <h3 className="text-xl font-serif text-gold mb-3">{COMMON.errorTitle}</h3>
            <p className="text-text-secondary text-sm mb-2">
              {isChunkError ? COMMON.errorChunk : COMMON.errorGeneric}
            </p>
            {this.state.error && (
              <p className="text-text-muted text-xs mb-6 bg-bg-secondary/50 rounded px-3 py-2 break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              {!isChunkError && (
                <Button variant="secondary" onClick={this.handleReset}>
                  {COMMON.retry}
                </Button>
              )}
              {isChunkError ? (
                <Button onClick={() => window.location.reload()}>
                  {COMMON.refreshPage}
                </Button>
              ) : (
                <Button onClick={() => window.location.href = '/'}>
                  {COMMON.backHome}
                </Button>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    )
  }
}

export default ErrorBoundary
