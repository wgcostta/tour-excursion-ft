// ARQUIVO: types/next-auth.d.ts - VERSÃO ATUALIZADA
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    userType?: string;
    needsProfileCompletion?: boolean;
    isNewUser?: boolean;
    googleAccessToken?: string;
    googleIdToken?: string;
    googleRefreshToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    userType?: 'CLIENTE' | 'ORGANIZADOR';
    accessToken?: string;
    refreshToken?: string;
    needsProfileCompletion?: boolean;
    isNewUser?: boolean;
    image?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    userType?: string;
    userId?: string;
    needsProfileCompletion?: boolean;
    isNewUser?: boolean;
    googleAccessToken?: string;
    googleIdToken?: string;
    googleRefreshToken?: string;
    exp?: number;
  }
}