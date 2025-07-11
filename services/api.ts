import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});



// lib/api.ts - ATUALIZAÇÃO DAS FUNÇÕES DE FORMATAÇÃO
// Adicionar estas funções ao final do arquivo lib/api.ts existente

// Utility functions - VERSÃO SSR-SAFE
export const formatCurrency = (value: number): string => {
  // Verificar se estamos no servidor
  if (typeof window === 'undefined') {
    // Formatação simples no servidor
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
  
  // Formatação completa no cliente
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  } catch (error) {
    // Fallback se Intl não estiver disponível
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
};

export const formatDate = (date: string | Date): string => {
  // Verificar se estamos no servidor
  if (typeof window === 'undefined') {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      // Formatação simples no servidor para evitar diferenças de timezone
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return '--/--/----';
    }
  }
  
  // Formatação completa no cliente
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  } catch (error) {
    return '--/--/----';
  }
};

export const formatDateTime = (date: string | Date): string => {
  // Verificar se estamos no servidor
  if (typeof window === 'undefined') {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return '--/--/---- --:--';
    }
  }
  
  // Formatação completa no cliente
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR');
  } catch (error) {
    return '--/--/---- --:--';
  }
};
