import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  // Making children optional resolves the "missing in type '{}'" error in index.tsx
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Explicitly extending React.Component with Props and State generics
class ErrorBoundary extends React.Component<Props, State> {
  // Explicitly defining state as a class property for better type inference
  public state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // Now properly typed access to this.state
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          fontFamily: 'sans-serif',
          background: '#fdfcf0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ color: '#065f46', fontSize: '2rem' }}>Muslim Hunt</h1>
          <p style={{ color: '#dc2626', marginTop: '20px', fontWeight: 'bold' }}>
            Something went wrong. Check console for details.
          </p>
          <pre style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: '#fee', 
            borderRadius: '12px',
            textAlign: 'left',
            overflow: 'auto',
            maxWidth: '90%',
            fontSize: '12px'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '30px',
              padding: '12px 24px',
              background: '#065f46',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    // Fix: Explicitly casting 'this' to any to resolve TS error where 'props' is not correctly identified on the instance
    return (this as any).props.children;
  }
}

export default ErrorBoundary;