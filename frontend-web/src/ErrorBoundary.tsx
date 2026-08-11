import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('UI error', error, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="error-fallback">
        <AlertTriangle size={34} />
        <h2>Something went wrong</h2>
        <p>An unexpected error occurred. Our team has been notified.</p>
        <button
          className="primary"
          onClick={() => this.setState({ hasError: false, error: undefined })}
        >
          Try again
        </button>
        {import.meta.env.DEV && this.state.error ? (
          <pre className="error-details">{this.state.error.stack ?? this.state.error.message}</pre>
        ) : null}
      </div>
    );
  }
}
