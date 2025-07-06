// pages/_error.tsx - VERSÃO CORRIGIDA
import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import ClientOnly from '../components/ClientOnly';

interface ErrorProps {
  statusCode: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

const ErrorPage: React.FC<ErrorProps> = ({ statusCode }) => {
  const getErrorMessage = (code: number) => {
    switch (code) {
      case 404:
        return {
          title: 'Página não encontrada',
          description: 'A página que você está procurando não existe ou foi movida.',
          icon: '🔍',
        };
      case 500:
        return {
          title: 'Erro interno do servidor',
          description: 'Ocorreu um erro inesperado. Nossa equipe foi notificada.',
          icon: '⚙️',
        };
      case 403:
        return {
          title: 'Acesso negado',
          description: 'Você não tem permissão para acessar esta página.',
          icon: '🔒',
        };
      default:
        return {
          title: 'Algo deu errado',
          description: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
          icon: '⚠️',
        };
    }
  };

  const error = getErrorMessage(statusCode);

  return (
    <>
      <Head>
        <title>{`Erro ${statusCode} | TourApp`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-red-100 rounded-full p-6">
              <AlertTriangle className="h-16 w-16 text-red-600" />
            </div>
          </div>

          {/* Error Info */}
          <div className="space-y-4">
            <div className="text-6xl font-bold text-gray-400">
              {statusCode}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900">
              {error.title}
            </h1>
            
            <p className="text-gray-600">
              {error.description}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </button>
            </div>

            {/* Additional Help */}
            <div className="text-sm text-gray-500">
              Se o problema persistir, entre em contato com{' '}
              <a
                href="mailto:suporte@tourapp.com"
                className="text-primary-600 hover:text-primary-500"
              >
                nosso suporte
              </a>
            </div>
          </div>

          {/* Development Info - Usando ClientOnly para evitar hidratação */}
          <ClientOnly fallback={null}>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Informações de Debug (apenas em desenvolvimento):
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Status Code: {statusCode}</div>
                  <div>Environment: {process.env.NODE_ENV}</div>
                  <div>Timestamp: {new Date().toISOString()}</div>
                </div>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default ErrorPage;