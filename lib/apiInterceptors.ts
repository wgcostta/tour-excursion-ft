
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
        const session = await getSession();
    const token = localStorage.getItem('token');

    if(!!token){
      console.log("token-interceptor", token)
      config.headers.Authorization = token;
    } else     if (session?.accessToken) {
      console.log("{session.accessToken", session.accessToken)
          config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => {
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
      // Erros específicos que não devem mostrar toast
      const silentErrors = [
        '/auth/refresh', // Refresh token expirado
        '/auth/me',      // Verificação de usuário
      ];

      const shouldShowError = !silentErrors.some(path => 
        error.config?.url?.includes(path)
      );

      // Erro 401 - redirecionar para login (apenas no cliente)
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        //const { signOut } = await import('next-auth/react');
        //await signOut({ redirect: false });
        //window.location.href = '/auth/login';
        console.log(error.response)
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
};
