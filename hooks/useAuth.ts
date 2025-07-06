
// hooks/useAuth.ts - VERSÃO CORRIGIDA COM REDIRECIONAMENTO AUTOMÁTICO
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  userType: 'CLIENTE' | 'ORGANIZADOR';
  image?: string;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCliente: boolean;
  isOrganizador: boolean;
  login: (email: string, password: string, userType: 'CLIENTE' | 'ORGANIZADOR') => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  redirectToLogin: () => void;
  redirectToDashboard: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user: AuthUser | null = session?.user ? {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    userType: (session.userType as 'CLIENTE' | 'ORGANIZADOR') || 'CLIENTE',
    image: session.user.image || undefined,
  } : null;

  const isLoading = status === 'loading';
  const isAuthenticated = !!session && !!user;
  const isCliente = user?.userType === 'CLIENTE';
  const isOrganizador = user?.userType === 'ORGANIZADOR';

  const redirectToDashboard = useCallback((): void => {
    if (user) {
      const dashboardUrl = user.userType === 'ORGANIZADOR' 
        ? '/organizador/dashboard' 
        : '/cliente/dashboard';
      
      console.log('🎯 Redirecionando para dashboard:', dashboardUrl);
      router.push(dashboardUrl);
    } else {
      console.log('🏠 Usuário não autenticado, redirecionando para home');
      router.push('/');
    }
  }, [router, user]);

  // CORREÇÃO: Adicionar redirecionamento automático quando necessário
  useEffect(() => {
    // Se estamos na rota /dashboard genérica e o usuário está autenticado
    if (router.pathname === '/dashboard' && isAuthenticated && user) {
      console.log('🔀 Detectado acesso a /dashboard genérico, redirecionando...');
      redirectToDashboard();
    }
    
    // Se estamos na home e o usuário acabou de fazer login
    if (router.pathname === '/' && isAuthenticated && user && 
        router.query.from === 'login') {
      console.log('🔀 Login detectado, redirecionando para dashboard...');
      redirectToDashboard();
    }
  }, [router.pathname, isAuthenticated, user, redirectToDashboard, router.query.from]);

  const login = useCallback(async (
    email: string, 
    password: string, 
    userType: 'CLIENTE' | 'ORGANIZADOR'
  ): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        userType,
        redirect: false,
      });

      if (result?.error) {
        console.error('Login error:', result.error);
        return false;
      }

      console.log('✅ Login bem-sucedido');
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<void> => {
    await signIn('google', { 
      callbackUrl: '/auth/complete-profile' 
    });
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await signOut({ 
      callbackUrl: '/' 
    });
  }, []);

  const redirectToLogin = useCallback((): void => {
    router.push('/auth/login');
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    isCliente,
    isOrganizador,
    login,
    loginWithGoogle,
    logout,
    redirectToLogin,
    redirectToDashboard,
  };
};