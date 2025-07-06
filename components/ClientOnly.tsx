
// components/ClientOnly.tsx
import React, { ReactNode } from 'react';
import { useClientOnly } from '../hooks/useClientOnly';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const isClient = useClientOnly();

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientOnly;