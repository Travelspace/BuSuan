import React from 'react'
import Button from '../Button'
import Card from '../Card'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card hover={false} className="max-w-md w-full text-center">
            <div className="text-6xl mb-4 opacity-30">⚠</div>
            <h3 className="text-xl font-serif text-gold mb-3">页面出现了问题</h3>
            <p className="text-text-secondary text-sm mb-2">
              抱歉，页面渲染时发生了错误
            </p>
            {this.state.error && (
              <p className="text-text-muted text-xs mb-6 bg-bg-secondary/50 rounded px-3 py-2 break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleReset}>
                重试
              </Button>
              <Button onClick={() => window.location.href = '/'}>
                返回首页
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
