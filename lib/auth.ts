// ARQUIVO: lib/auth.ts - FLUXO CORRIGIDO
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

// Interface para o usuário customizado
interface CustomUser {
  id: string;
  email: string;
  name: string;
  userType?: 'CLIENTE' | 'ORGANIZADOR';
  accessToken?: string;
  refreshToken?: string;
  needsProfileCompletion?: boolean;
}

// Função para obter a URL da API
const getApiUrl = () => {
  // No servidor (SSR), usar a URL interna
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  // No cliente, usar a URL pública
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
};

// Configuração do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const apiUrl = getApiUrl();
          console.log('🔗 Fazendo login via:', `${apiUrl}/auth/login`);
          
          // Chamada para a API de login do backend
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              senha: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error('Login failed:', response.status, response.statusText);
            return null;
          }

          const data = await response.json();

          // Retorna o usuário se a autenticação for bem-sucedida
          if (data.success && data) {
            return {
              id: data?.userId || data.id,
              email: data.email,
              name: data?.name || data.nome,
              userType: data.tipoUsuario || credentials.userType as 'CLIENTE' | 'ORGANIZADOR',
              accessToken: data.token,
              refreshToken: data.refreshToken,
              needsProfileCompletion: false,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    }),
  ],
  
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const apiUrl = getApiUrl();
          console.log('🔄 Tentando autenticar com Google no backend');
          console.log('🔗 URL da API:', `${apiUrl}/auth/google`);
          
          // Chamar nossa API para verificar/criar usuário com Google
          const response = await fetch(`${apiUrl}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: account.id_token,
              email: user.email,
              name: user.name,
              picture: user.image,
            }),
          });

          console.log(response)
          const data = await response.json();
          console.log('📨 Resposta do backend Google auth:', { 
            status: response.status, 
            success: data.success 
          });

          if (response.ok && data.success) {
            // ✅ USUÁRIO JÁ EXISTE E ESTÁ COMPLETO
            console.log('✅ Usuário autenticado com sucesso');
            user.id = data?.userId || data.id;
            user.userType = data.tipoUsuario;
            user.accessToken = data.token;
            user.refreshToken = data.refreshToken;
            user.needsProfileCompletion = false;
            return true;
          } 
          else if (response.status === 404 || !data.success) {
            // ❓ USUÁRIO NÃO EXISTE OU PERFIL INCOMPLETO
            console.log('❓ Usuário precisa completar perfil');
            user.needsProfileCompletion = true;
            user.accessToken = data?.token || data?.tempToken || account.access_token; // Token temporário do backend
            user.refreshToken = undefined;
            user.userType = undefined;
            return true; // Permitir login mas marcar como incompleto
          }
          else {
            console.error('❌ Erro na autenticação Google:', response.status, data.message);
            return false;
          }
        } catch (error) {
          console.error('❌ Erro na chamada da API Google:', error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }: { token: JWT; user?: CustomUser; account?: any }) {
      // Primeiro login - persistir dados do usuário no token
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userType = user.userType;
        token.userId = user.id;
        token.needsProfileCompletion = user.needsProfileCompletion;
      }

      // Se o token está expirando, tentar renovar (apenas se não precisa completar perfil)
      if (token.refreshToken && token.accessToken && !token.needsProfileCompletion && 
          Date.now() > (token.exp as number) * 1000 - 60000) {
        try {
          const apiUrl = getApiUrl();
          const response = await fetch(`${apiUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              token.accessToken = data.accessToken;
              token.refreshToken = data.refreshToken;
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          // Se falhar ao renovar, forçar novo login
          token.accessToken = null;
          token.refreshToken = null;
        }
      }

      return token;
    },
    
    async session({ session, token }) {
      // Enviar propriedades para o cliente
      if (session.user) {
        session.user.id = token?.userId || token.id as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.userType = token.userType as string;
        session.needsProfileCompletion = token.needsProfileCompletion as boolean;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Verificar se precisa completar perfil baseado na URL
      const urlObj = new URL(url.startsWith('/') ? baseUrl + url : url);
      
      // Se está tentando acessar complete-profile, permitir
      if (urlObj.pathname === '/auth/complete-profile') {
        return url;
      }
      
      // Se tem callback e precisa completar perfil, redirecionar
      if (urlObj.searchParams.get('callbackUrl')?.includes('complete-profile')) {
        return `${baseUrl}/auth/complete-profile`;
      }
      
      // Redirect padrão
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return baseUrl;
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};