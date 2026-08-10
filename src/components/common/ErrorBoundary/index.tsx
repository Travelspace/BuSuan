import React from 'react'
import Button from '../Button'
import Card from '../Card'
import { useTranslation } from '../../../i18n'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  resetKey: number
}

interface ErrorFallbackProps {
  error: Error | null
  isChunkError: boolean
  onReset: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, isChunkError, onReset }) => {
  const t = useTranslation()
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card hover={false} className="max-w-md w-full text-center">
        <div className="text-6xl mb-4 opacity-30">⚠</div>
        <h3 className="text-xl font-serif text-gold mb-3">{t.COMMON.errorTitle}</h3>
        <p className="text-text-secondary text-sm mb-2">
          {isChunkError ? t.COMMON.errorChunk : t.COMMON.errorGeneric}
        </p>
        {error && (
          <p className="text-text-muted text-xs mb-6 bg-bg-secondary/50 rounded px-3 py-2 break-all">
            {error.message}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          {!isChunkError && (
            <Button variant="secondary" onClick={onReset}>
              {t.COMMON.retry}
            </Button>
          )}
          {isChunkError ? (
            <Button onClick={() => window.location.reload()}>
              {t.COMMON.refreshPage}
            </Button>
          ) : (
            <Button onClick={() => window.location.href = '/'}>
              {t.COMMON.backHome}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
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
        <ErrorFallback
          error={this.state.error}
          isChunkError={isChunkError}
          onReset={this.handleReset}
        />
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
