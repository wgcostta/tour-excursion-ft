// pages/_error.tsx
import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

const ErrorPage = ({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) => {
  const [mounted, setMounted] = useState(false);
  console.error("++++" + statusCode + err)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar erro de hidratação não renderizando timestamps no servidor
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {statusCode || 'Erro'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {statusCode === 404
              ? 'Página não encontrada'
              : 'Ocorreu um erro no servidor'}
          </p>
          <div className="space-y-4">
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Voltar ao início
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          {statusCode || 'Erro'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {statusCode === 404
            ? 'Página não encontrada'
            : 'Ocorreu um erro no servidor'}
        </p>
        <div className="space-y-4">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md max-w-2xl mx-auto">
            <h3 className="font-medium text-gray-900">Debug Info:</h3>
            <div className="mt-2 text-xs text-gray-600 text-left">
              <p>Status Code: {statusCode}</p>
              <p>Has GetInitialProps Run: {hasGetInitialPropsRun ? 'Yes' : 'No'}</p>
              <p>Timestamp: {new Date().toISOString()}</p>
              {err && (
                <pre className="mt-2 whitespace-pre-wrap">
                  {err.message}
                  {err.stack}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;