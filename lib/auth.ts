// lib/auth.ts - CORREÇÃO DO REDIRECIONAMENTO
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

interface CustomUser {
  id: string;
  email: string;
  name: string;
  userType?: 'CLIENTE' | 'ORGANIZADOR';
  accessToken?: string;
  refreshToken?: string;
  needsProfileCompletion?: boolean;
  image?: string;
}

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
};

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

          const data = await response.json();
          console.log('📨 Resposta do backend Google auth:', { 
            status: response.status, 
            success: data.success,
            needsCompletion: data.needsProfileCompletion 
          });

          if (response.ok && data.success) {
            console.log('✅ Usuário autenticado com sucesso');
            user.id = data?.userId || data.id;
            user.userType = data.tipoUsuario;
            user.accessToken = data.token;
            user.refreshToken = data.refreshToken;
            user.needsProfileCompletion = false;
            user.image = user.image || data.avatar;
            return true;
          } 
          else if (response.status === 404 || !data.success || data.needsProfileCompletion) {
            console.log('❓ Usuário precisa completar perfil');
            user.needsProfileCompletion = true;
            user.accessToken = data?.token || data?.tempToken || account.access_token;
            user.refreshToken = undefined;
            user.userType = undefined;
            return true;
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
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userType = user.userType;
        token.userId = user.id;
        token.needsProfileCompletion = user.needsProfileCompletion;
        token.picture = user.image;
      }

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
          token.accessToken = null;
          token.refreshToken = null;
        }
      }

      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token?.userId || token.id as string;
        session.user.image = token.picture as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.userType = token.userType as string;
        session.needsProfileCompletion = token.needsProfileCompletion as boolean;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback:', { url, baseUrl });

      const urlObj = new URL(url.startsWith('/') ? baseUrl + url : url);
      const needsCompletion = urlObj.searchParams.get('needsProfileCompletion');
      
      if (needsCompletion === 'true') {
        const name = urlObj.searchParams.get('name') || '';
        const email = urlObj.searchParams.get('email') || '';
        const image = urlObj.searchParams.get('image') || '';
        
        return `${baseUrl}/auth/complete-profile?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&image=${encodeURIComponent(image)}`;
      }
      
      // CORREÇÃO: Em vez de redirecionar para /dashboard genérico,
      // deixar o useAuth.redirectToDashboard() fazer o trabalho
      if (url === baseUrl || url === `${baseUrl}/` || url === `${baseUrl}/dashboard`) {
        // Retornar para a home e deixar o useAuth redirecionar corretamente
        return baseUrl;
      }
      
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return baseUrl;
    },
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
