import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

// Interface para o usuário customizado
interface CustomUser {
  id: string;
  email: string;
  name: string;
  userType: 'CLIENTE' | 'ORGANIZADOR';
  accessToken?: string;
  refreshToken?: string;
}

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
          // Chamada para a API de login do backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
          if (data.success && data.data) {
            return {
              id: data.data.userId || data.data.id,
              email: data.data.email,
              name: data.data.name || data.data.nome,
              userType: data.data.tipoUsuario || credentials.userType as 'CLIENTE' | 'ORGANIZADOR',
              accessToken: data.data.token,
              refreshToken: data.data.refreshToken,
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
          response_type: "code"
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
          // Para login com Google, precisamos validar com nosso backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: account.id_token,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Adicionar dados do backend ao user object
              user.id = data.data.userId || data.data.id;
              user.userType = data.data.tipoUsuario;
              user.accessToken = data.data.token;
              user.refreshToken = data.data.refreshToken;
              return true;
            }
          }
          
          // Se não conseguiu autenticar, redirecionar para completar perfil
          return `/auth/complete-profile?email=${encodeURIComponent(user.email!)}&name=${encodeURIComponent(user.name!)}&image=${encodeURIComponent(user.image || '')}`;
        } catch (error) {
          console.error('Google auth error:', error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }: { token: JWT; user?: CustomUser; account?: any }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userType = user.userType;
        token.userId = user.id;
      }

      // Se o token está expirando, tentar renovar
      if (token.refreshToken && Date.now() > (token.exp as number) * 1000 - 60000) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
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
              token.accessToken = data.data.accessToken;
              token.refreshToken = data.data.refreshToken;
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
      // Send properties to the client
      if (session.user) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.userType = token.userType as string;
      }
      return session;
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