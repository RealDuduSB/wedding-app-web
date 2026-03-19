'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary] Caught error:', error);
      console.error('[ErrorBoundary] Component stack:', info.componentStack);
    } else {
      console.error('[ErrorBoundary] An unexpected error occurred:', error.message);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-100 flex items-center justify-center px-4 py-16"
        >
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl" aria-hidden="true">💐</div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-wedding-primary">
                Algo deu errado
              </h2>
              <p className="text-gray-600">
                Pedimos desculpas pelo inconveniente. Ocorreu um erro inesperado nesta página.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-block bg-wedding-primary text-white px-6 py-3 rounded-md hover:bg-wedding-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-wedding-primary focus:ring-offset-2"
              aria-label="Recarregar a página"
            >
              Recarregar Página
            </button>

            <p className="text-sm text-gray-500">
              Se o problema persistir, entre em contato conosco pelo e-mail{' '}
              <a
                href="mailto:contato@casamento-andressa-eduardo.com"
                className="text-wedding-primary underline hover:text-wedding-primary-light"
              >
                contato@casamento-andressa-eduardo.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
