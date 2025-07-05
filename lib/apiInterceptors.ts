// lib/apiInterceptors.ts
import axios, { AxiosResponse, AxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { errorInterceptor } from './errorInterceptor';

// Configurar interceptors do axios
export const setupApiInterceptors = () => {
  // Verificar se os interceptors já foram configurados
  if (axios.defaults.headers.common['X-Interceptors-Configured']) {
    return;
  }

  // Request interceptor - adicionar token
  axios.interceptors.request.use(
    async (config) => {
      console.log('🔧 Request interceptor executado para:', config.url);
      
      // Verificar se estamos no cliente
      if (typeof window === 'undefined') {
        return config;
      }

      // Pega o token de sessão
      if (config.baseURL?.includes("auth/google")) {
        return config;
      }
      
      // Primeiro, tentar obter token do localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('✅ Token encontrado no localStorage');
        // Garantir que o token tenha o prefixo Bearer
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.Authorization = formattedToken;
        console.log('🔑 Token adicionado ao header:', formattedToken.substring(0, 20) + '...');
      } else {
        // Se não houver token no localStorage, tentar session do NextAuth
        try {
          const session = await getSession();
          
          if (session?.accessToken) {
            console.log('✅ Token encontrado na sessão NextAuth');
            const formattedToken = session.accessToken.startsWith('Bearer ') 
              ? session.accessToken 
              : `Bearer ${session.accessToken}`;
            config.headers.Authorization = formattedToken;
            console.log('🔑 Token da sessão adicionado ao header:', formattedToken.substring(0, 20) + '...');
          } else {
            console.log('❌ Nenhum token encontrado');
          }
        } catch (sessionError) {
          console.warn('⚠️ Erro ao obter sessão:', sessionError);
        }
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Erro no request interceptor:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - tratar erros
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      // Sucesso - retornar resposta normalmente
      return response;
    },
    async (error: AxiosError) => {
      console.log('🔥 Response interceptor - erro capturado:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message
      });

      // Erros específicos que não devem mostrar toast
      const silentErrors = [
        '/auth/refresh', // Refresh token expirado
        '/auth/me',      // Verificação de usuário
        '/api/health',   // Health check
      ];

      const shouldShowError = !silentErrors.some(path => 
        error.config?.url?.includes(path)
      );

      // Erro 401 - token inválido ou expirado
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        console.log('🚨 Erro 401 detectado - token inválido');
        
        // Limpar tokens inválidos
        localStorage.removeItem('token');
        
        // Se não for uma rota de autenticação, redirecionar
        if (!error.config?.url?.includes('/auth/')) {
          console.log('🔄 Redirecionando para login');
          
          // Tentar usar signOut do NextAuth se disponível
          try {
            await signOut({ callbackUrl: '/auth/login', redirect: true });
          } catch (signOutError) {
            // Fallback para redirecionamento manual
            window.location.href = '/auth/login';
          }
        }
        
        return Promise.reject(error);
      }

      // Erro 429 - Rate limiting
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
        
        console.log(`⏱️ Rate limit detectado. Aguardando ${waitTime}ms...`);
        
        if (shouldShowError) {
          errorInterceptor.handleError(error, {
            showToast: true,
            showFieldErrors: false,
            customMessage: `Muitas requisições. Tente novamente em ${Math.ceil(waitTime / 1000)} segundos.`,
            duration: waitTime,
          });
        }
        
        return Promise.reject(error);
      }

      // Erro 503 - Serviço indisponível
      if (error.response?.status === 503) {
        if (shouldShowError) {
          errorInterceptor.handleError(error, {
            showToast: true,
            showFieldErrors: false,
            customMessage: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.',
            duration: 8000,
          });
        }
        
        return Promise.reject(error);
      }

      // Erro de rede/conectividade
      if (!error.response && error.code === 'ERR_NETWORK') {
        if (shouldShowError) {
          errorInterceptor.handleError(error, {
            showToast: true,
            showFieldErrors: false,
            customMessage: 'Problema de conectividade. Verifique sua conexão com a internet.',
            duration: 6000,
          });
        }
        
        return Promise.reject(error);
      }

      // Timeout
      if (error.code === 'ECONNABORTED') {
        if (shouldShowError) {
          errorInterceptor.handleError(error, {
            showToast: true,
            showFieldErrors: false,
            customMessage: 'Requisição demorou muito para responder. Tente novamente.',
            duration: 5000,
          });
        }
        
        return Promise.reject(error);
      }

      // Processar erro através do interceptor centralizado
      if (shouldShowError) {
        return errorInterceptor.handleError(error, {
          showToast: true,
          showFieldErrors: true,
        });
      }

      return Promise.reject(error);
    }
  );

  // Marcar que os interceptors foram configurados
  axios.defaults.headers.common['X-Interceptors-Configured'] = 'true';
  console.log('✅ Interceptors API configurados com sucesso');
};

// Função para limpar configurações (útil para testes)
export const clearApiInterceptors = (): void => {
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
  delete axios.defaults.headers.common['X-Interceptors-Configured'];
  console.log('🧹 Interceptors API limpos');
};

// Função para configurar timeout padrão
export const configureApiDefaults = (): void => {
  axios.defaults.timeout = 30000; // 30 segundos
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';
};

// Função para obter informações de debug dos interceptors
export const getInterceptorDebugInfo = () => {
  return {
    requestInterceptors: axios.interceptors.request.handlers.length,
    responseInterceptors: axios.interceptors.response.handlers.length,
    isConfigured: !!axios.defaults.headers.common['X-Interceptors-Configured'],
    defaultTimeout: axios.defaults.timeout,
    baseURL: axios.defaults.baseURL,
  };
};