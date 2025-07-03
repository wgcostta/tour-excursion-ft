import api from './api';
import { JwtResponse, User, TokenRefreshResponse } from '@/types/auth';

class AuthService {
  async loginWithGoogle(idToken: string): Promise<JwtResponse> {
    try {
      const response = await api.post('/api/v1/auth/google', {
        idToken
      });
      
      const { token, refreshToken, ...userData } = response.data;
      
      // Salvar tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.response?.data?.error?.message || 'Erro na autenticação');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  async getUserInfo(): Promise<User> {
    try {
      const response = await api.get('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }
}

export default new AuthService();

