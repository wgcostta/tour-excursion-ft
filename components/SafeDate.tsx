
// components/SafeDate.tsx
import React from 'react';
import { useClientOnly } from '../hooks/useClientOnly';

interface SafeDateProps {
  date: string | Date;
  format?: 'date' | 'datetime' | 'time';
  className?: string;
  fallback?: string;
}

const SafeDate: React.FC<SafeDateProps> = ({ 
  date, 
  format = 'datetime', 
  className = '',
  fallback = 'Carregando...' 
}) => {
  const isClient = useClientOnly();

  if (!isClient) {
    return <span className={className}>{fallback}</span>;
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formatDate = () => {
    switch (format) {
      case 'date':
        return dateObj.toLocaleDateString('pt-BR');
      case 'time':
        return dateObj.toLocaleTimeString('pt-BR');
      case 'datetime':
      default:
        return dateObj.toLocaleString('pt-BR');
    }
  };

  return <span className={className}>{formatDate()}</span>;
};

export default SafeDate;
