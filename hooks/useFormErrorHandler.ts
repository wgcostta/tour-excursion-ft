
// ARQUIVO: hooks/useFormErrorHandler.ts - VERSÃO CORRIGIDA
import { useEffect, useRef, useCallback } from 'react';
import { useFormErrorTooltip } from './useFormErrorTooltip';

export const useFormErrorHandler = (formId: string) => {
  const formIdRef = useRef(formId);
  const {
    showFieldError,
    hideFieldError,
    clearAllErrors,
    isFieldErrorVisible,
    getFieldError,
  } = useFormErrorTooltip();

  // Handler para receber erros do interceptor
  const handleFieldError = useCallback((field: string, message: string) => {
    showFieldError(field, message);
  }, [showFieldError]);

  // Registrar/desregistrar handler
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window !== 'undefined') {
      // Importação dinâmica para evitar problemas no SSR
      import('../lib/errorInterceptor').then(({ errorInterceptor }) => {
        errorInterceptor.registerFieldErrorHandler(formIdRef.current, handleFieldError);
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        import('../lib/errorInterceptor').then(({ errorInterceptor }) => {
          errorInterceptor.unregisterFieldErrorHandler(formIdRef.current);
        });
      }
    };
  }, [handleFieldError]);

  return {
    showFieldError,
    hideFieldError,
    clearAllErrors,
    isFieldErrorVisible,
    getFieldError,
    formId: formIdRef.current,
  };
};