import * as Sentry from '@sentry/nextjs'
import { Component, ErrorInfo, ReactNode } from 'react'

interface IState {
  hasError: boolean
}

interface IProps {
  children: ReactNode
}

export default class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): IState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(errorInfo)
    }
  }

  render(): ReactNode {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return <h4>Sorry.. there was an error</h4>
    }

    return children
  }
}
