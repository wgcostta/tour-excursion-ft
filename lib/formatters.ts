// lib/formatters.ts - VERSÃO SSR-SAFE
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
      return dateObj.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
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
      // Formatação simples no servidor
      return dateObj.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
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

export const formatTime = (date: string | Date): string => {
  // Verificar se estamos no servidor
  if (typeof window === 'undefined') {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString('pt-BR', { 
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '--:--';
    }
  }
  
  // Formatação completa no cliente
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '--:--';
  }
};