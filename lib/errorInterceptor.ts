
// ARQUIVO: lib/errorInterceptor.ts - VERSÃO CORRIGIDA
import { AxiosError } from 'axios';

interface ApiError {
  message: string;
  validationErrors?: Record<string, string>;
  status?: number;
  code?: string;
}

interface ErrorDisplayOptions {
  showToast?: boolean;
  showFieldErrors?: boolean;
  customMessage?: string;
  duration?: number;
}

class ErrorInterceptor {
  private static instance: ErrorInterceptor;
  private fieldErrorHandlers: Map<string, (field: string, message: string) => void> = new Map();
  private globalErrorHandler?: (error: ApiError) => void;

  static getInstance(): ErrorInterceptor {
    if (!ErrorInterceptor.instance) {
      ErrorInterceptor.instance = new ErrorInterceptor();
    }
    return ErrorInterceptor.instance;
  }

  // Registrar handler para erros de campo específicos de um formulário
  registerFieldErrorHandler(formId: string, handler: (field: string, message: string) => void) {
    this.fieldErrorHandlers.set(formId, handler);
  }

  // Remover handler quando componente for desmontado
  unregisterFieldErrorHandler(formId: string) {
    this.fieldErrorHandlers.delete(formId);
  }

  // Registrar handler global para erros
  setGlobalErrorHandler(handler: (error: ApiError) => void) {
    this.globalErrorHandler = handler;
  }

  // Processar erro interceptado
  handleError(error: AxiosError, options: ErrorDisplayOptions = {}): Promise<never> {
    const {
      showToast = true,
      showFieldErrors = true,
      customMessage,
      duration = 5000
    } = options;

    const apiError = this.parseError(error);

    // 1. Tentar mostrar erros de campo primeiro
    if (showFieldErrors && apiError.validationErrors) {
      const hasFieldHandler = this.showFieldErrors(apiError.validationErrors);
      
      // Se não há handler de campo ativo, mostrar como toast
      if (!hasFieldHandler && showToast) {
        this.showValidationToast(apiError.validationErrors, duration);
      }
    }
    // 2. Mostrar erro geral como toast
    else if (showToast) {
      this.showErrorToast(customMessage || apiError.message, duration);
    }

    // 3. Chamar handler global se existir
    if (this.globalErrorHandler) {
      this.globalErrorHandler(apiError);
    }

    return Promise.reject(error);
  }

  private parseError(error: AxiosError): ApiError {
    const responseData = error.response?.data as any;
    
    return {
      message: responseData?.message || 
               responseData?.error?.message || 
               this.getDefaultErrorMessage(error.response?.status),
      validationErrors: responseData?.validationErrors || 
                       responseData?.errors || 
                       responseData?.fieldErrors,
      status: error.response?.status,
      code: responseData?.code || responseData?.error?.code,
    };
  }

  private getDefaultErrorMessage(status?: number): string {
    switch (status) {
      case 400: return 'Dados inválidos enviados';
      case 401: return 'Você não está autenticado';
      case 403: return 'Você não tem permissão para esta ação';
      case 404: return 'Recurso não encontrado';
      case 409: return 'Conflito com dados existentes';
      case 422: return 'Dados de entrada inválidos';
      case 429: return 'Muitas tentativas. Tente novamente mais tarde';
      case 500: return 'Erro interno do servidor';
      case 502: return 'Servidor temporariamente indisponível';
      case 503: return 'Serviço temporariamente indisponível';
      default: return 'Erro inesperado. Tente novamente';
    }
  }

  private showFieldErrors(validationErrors: Record<string, string>): boolean {
    let hasActiveHandler = false;

    // Tentar mostrar erros em todos os handlers ativos
    this.fieldErrorHandlers.forEach((handler) => {
      Object.entries(validationErrors).forEach(([field, message]) => {
        try {
          handler(field, message);
          hasActiveHandler = true;
        } catch (e) {
          // Handler pode não conseguir processar o campo, continuar
        }
      });
    });

    return hasActiveHandler;
  }

  private showValidationToast(validationErrors: Record<string, string>, duration: number) {
    // Verificar se está no cliente antes de usar toast
    if (typeof window !== 'undefined') {
      import('react-hot-toast').then(({ toast }) => {
        const errors = Object.entries(validationErrors);
        
        if (errors.length === 1) {
          // Único erro
          const [field, message] = errors[0];
          toast.error(`${this.formatFieldName(field)}: ${message}`, {
            duration,
            style: { maxWidth: '400px' },
          });
        } else {
          // Múltiplos erros
          const errorList = errors
            .map(([field, message]) => `• ${this.formatFieldName(field)}: ${message}`)
            .join('\n');
          
          toast.error(`Erros encontrados:\n${errorList}`, {
            duration,
            style: { 
              maxWidth: '500px',
              whiteSpace: 'pre-line',
            },
          });
        }
      });
    }
  }

  private showErrorToast(message: string, duration: number) {
    // Verificar se está no cliente antes de usar toast
    if (typeof window !== 'undefined') {
      import('react-hot-toast').then(({ toast }) => {
        toast.error(message, {
          duration,
          style: { maxWidth: '400px' },
        });
      });
    }
  }

  private formatFieldName(field: string): string {
    // Converter camelCase para texto legível
    const formatted = field
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());

    // Mapeamentos específicos se necessário
    const fieldMappings: Record<string, string> = {
      'nomeCompleto': 'Nome completo',
      'nomeEmpresa': 'Nome da empresa',
      'dataSaida': 'Data de saída',
      'dataRetorno': 'Data de retorno',
      'localSaida': 'Local de saída',
      'localDestino': 'Local de destino',
      'vagasTotal': 'Total de vagas',
      'aceitaPix': 'Aceita PIX',
      'aceitaCartao': 'Aceita cartão',
    };

    return fieldMappings[field] || formatted;
  }
}

export const errorInterceptor = ErrorInterceptor.getInstance();
