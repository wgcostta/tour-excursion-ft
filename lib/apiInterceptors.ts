// ARQUIVO: lib/apiInterceptors.ts - VERSÃO CORRIGIDA
import axios from 'axios';
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
    (response) => {
      // Sucesso - retornar resposta normalmente
      return response;
    },
    async (error) => {
      console.log('🔥 Response interceptor - erro capturado:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.response?.data?.message || error.message
      });

      // Erros específicos que não devem mostrar toast
      const silentErrors = [
        '/auth/refresh', // Refresh token expirado
        '/auth/me',      // Verificação de usuário
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
          window.location.href = '/auth/login';
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
  console.log('✅ Interceptors configurados com sucesso');
};

// Função para limpar configurações (útil para testes)
export const clearApiInterceptors = () => {
  axios.interceptors.request.clear();
  axios.interceptors.response.clear();
  delete axios.defaults.headers.common['X-Interceptors-Configured'];
  console.log('🧹 Interceptors limpos');
};