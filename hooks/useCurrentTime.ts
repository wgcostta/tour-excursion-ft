

// hooks/useCurrentTime.ts
import { useState, useEffect } from 'react';

export const useCurrentTime = (updateInterval: number = 1000) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Definir o tempo inicial apenas no cliente
    setCurrentTime(new Date());

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return currentTime;
};
