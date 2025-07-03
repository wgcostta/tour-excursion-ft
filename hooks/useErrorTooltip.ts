// hooks/useErrorTooltip.ts
import { useState, useCallback, useEffect } from 'react';

interface UseErrorTooltipReturn {
  isVisible: boolean;
  showTooltip: (message: string) => void;
  hideTooltip: () => void;
  toggleTooltip: (message?: string) => void;
  message: string;
}

interface UseErrorTooltipOptions {
  autoHideDelay?: number;
  persistOnHover?: boolean;
}

export const useErrorTooltip = (
  options: UseErrorTooltipOptions = {}
): UseErrorTooltipReturn => {
  const { autoHideDelay, persistOnHover = false } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearAutoHideTimeout = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const showTooltip = useCallback((msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    
    // Clear any existing timeout
    clearAutoHideTimeout();
    
    // Set auto-hide timeout if specified
    if (autoHideDelay && autoHideDelay > 0) {
      const id = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);
      setTimeoutId(id);
    }
  }, [autoHideDelay, clearAutoHideTimeout]);

  const hideTooltip = useCallback(() => {
    clearAutoHideTimeout();
    setIsVisible(false);
  }, [clearAutoHideTimeout]);

  const toggleTooltip = useCallback((msg?: string) => {
    if (isVisible) {
      hideTooltip();
    } else if (msg) {
      showTooltip(msg);
    }
  }, [isVisible, hideTooltip, showTooltip]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearAutoHideTimeout();
    };
  }, [clearAutoHideTimeout]);

  return {
    isVisible,
    showTooltip,
    hideTooltip,
    toggleTooltip,
    message,
  };
};

// Hook especializado para formulários
export const useFormErrorTooltip = () => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showFieldError = useCallback((fieldName: string, errorMessage: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
    setActiveField(fieldName);
  }, []);

  const hideFieldError = useCallback((fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      if (activeField === fieldName) {
        setActiveField(null);
      }
    } else {
      setActiveField(null);
    }
  }, [activeField]);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setActiveField(null);
  }, []);

  const isFieldErrorVisible = useCallback((fieldName: string) => {
    return activeField === fieldName && !!errors[fieldName];
  }, [activeField, errors]);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName] || '';
  }, [errors]);

  return {
    showFieldError,
    hideFieldError,
    clearAllErrors,
    isFieldErrorVisible,
    getFieldError,
    activeField,
    hasErrors: Object.keys(errors).length > 0,
  };
};