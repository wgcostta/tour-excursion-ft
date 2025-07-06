
// components/SafeHydration.tsx - Componente para evitar problemas de hidratação
import React, { useState, useEffect, ReactNode } from 'react';

interface SafeHydrationProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SafeHydration: React.FC<SafeHydrationProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SafeHydration;

// utils/date.ts - Utilitários de data seguros para SSR
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const safeFormatDate = (
  date: string | Date | null | undefined,
  fallback: string = '--'
): string => {
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValidDate(dateObj)) {
      return fallback;
    }
    
    // Formatação que funciona tanto no servidor quanto no cliente
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.warn('Erro ao formatar data:', error);
    return fallback;
  }
};

export const safeFormatDateTime = (
  date: string | Date | null | undefined,
  fallback: string = '--'
): string => {
  if (!date) return fallback;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValidDate(dateObj)) {
      return fallback;
    }
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.warn('Erro ao formatar data/hora:', error);
    return fallback;
  }
};