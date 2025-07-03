import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';

// Interface para o usuário customizado
interface CustomUser {
  id: string;
  email: string;
  name: string;
  userType: 'CLIENTE' | 'ORGANIZADOR';
  accessToken?: string;
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
          // Aqui você fará a chamada para sua API backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          // Retorna o usuário se a autenticação for bem-sucedida
          if (data.user && data.accessToken) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              userType: data.user.userType,
              accessToken: data.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },
  
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: CustomUser }) {
      // Persist the OAuth access_token and user info to the token right after signin
      if (user) {
        token.accessToken = user.accessToken;
        token.userType = user.userType;
        token.userId = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.userId as string;
        session.accessToken = token.accessToken as string;
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