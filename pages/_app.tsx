// ARQUIVO: pages/_app.tsx - VERSÃO FINAL COM INTERCEPTOR
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import ErrorProvider from '../components/ErrorProvider';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <ErrorBoundary>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {/* ErrorProvider configura os interceptors automaticamente */}
          <ErrorProvider>
            <Component {...pageProps} />
          </ErrorProvider>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
                padding: '12px 16px',
                maxWidth: '400px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
                style: {
                  background: '#059669',
                  color: '#fff',
                  border: '1px solid #10b981',
                },
              },
              error: {
                duration: 6000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#dc2626',
                  color: '#fff',
                  border: '1px solid #ef4444',
                },
              },
              loading: {
                duration: Infinity,
                style: {
                  background: '#3b82f6',
                  color: '#fff',
                  border: '1px solid #2563eb',
                },
              },
            }}
          />
          
          {/* React Query DevTools */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
