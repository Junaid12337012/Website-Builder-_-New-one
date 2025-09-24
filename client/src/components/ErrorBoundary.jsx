import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You could send this to a logging service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-app py-8">
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
            <div className="font-semibold mb-1">An error occurred while rendering.</div>
            <pre className="whitespace-pre-wrap text-sm">{String(this.state.error)}</pre>
            <button onClick={() => location.reload()} className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white">Reload</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
