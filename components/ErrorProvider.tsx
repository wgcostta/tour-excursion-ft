// ARQUIVO: components/ErrorProvider.tsx - VERSÃO CORRIGIDA
import React, { useEffect, ReactNode } from 'react';

interface ErrorProviderProps {
  children: ReactNode;
}

const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  useEffect(() => {
    // Configurar interceptors apenas no cliente
    if (typeof window !== 'undefined') {
      // Importação dinâmica para evitar problemas no SSR
      import('../lib/apiInterceptors').then(({ setupApiInterceptors }) => {
        setupApiInterceptors();
      });

      import('../lib/errorInterceptor').then(({ errorInterceptor }) => {
        // Configurar handler global opcional
        errorInterceptor.setGlobalErrorHandler((error) => {
          // Log para debugging
          if (process.env.NODE_ENV === 'development') {
            console.group('🚨 Erro capturado pelo interceptor:');
            console.log('Message:', error.message);
            console.log('Status:', error.status);
            console.log('Code:', error.code);
            console.log('Validation Errors:', error.validationErrors);
            console.groupEnd();
          }
        });
      });
    }
  }, []);

  return <>{children}</>;
};

export default ErrorProvider;
