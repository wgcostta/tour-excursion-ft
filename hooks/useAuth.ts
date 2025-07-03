import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

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

  const redirectToDashboard = useCallback((): void => {
    if (user) {
      const dashboardUrl = user.userType === 'ORGANIZADOR' 
        ? '/organizador/dashboard' 
        : '/cliente/dashboard';
      router.push(dashboardUrl);
    } else {
      router.push('/');
    }
  }, [router, user]);

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