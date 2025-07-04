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

  const toggleFieldError = useCallback((fieldName: string, errorMessage: string) => {
    if (isFieldErrorVisible(fieldName)) {
      hideFieldError(fieldName);
    } else {
      showFieldError(fieldName, errorMessage);
    }
  }, [isFieldErrorVisible, hideFieldError, showFieldError]);

  const hasAnyErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  const getAllErrors = useCallback(() => {
    return { ...errors };
  }, [errors]);

  const getErrorCount = useCallback(() => {
    return Object.keys(errors).length;
  }, [errors]);

  const setFieldErrors = useCallback((fieldErrors: Record<string, string>) => {
    setErrors(fieldErrors);
    // Set the first field with error as active
    const firstFieldWithError = Object.keys(fieldErrors)[0];
    if (firstFieldWithError) {
      setActiveField(firstFieldWithError);
    }
  }, []);

  return {
    showFieldError,
    hideFieldError,
    clearAllErrors,
    isFieldErrorVisible,
    getFieldError,
    toggleFieldError,
    setFieldErrors,
    activeField,
    hasErrors: Object.keys(errors).length > 0,
    hasAnyErrors,
    getAllErrors,
    getErrorCount,
  };
};

// Hook para múltiplos tooltips simultâneos
export const useMultipleErrorTooltips = () => {
  const [tooltips, setTooltips] = useState<Record<string, { visible: boolean; message: string }>>({});

  const showTooltip = useCallback((id: string, message: string) => {
    setTooltips(prev => ({
      ...prev,
      [id]: { visible: true, message }
    }));
  }, []);

  const hideTooltip = useCallback((id: string) => {
    setTooltips(prev => ({
      ...prev,
      [id]: { visible: false, message: '' }
    }));
  }, []);

  const hideAllTooltips = useCallback(() => {
    setTooltips({});
  }, []);

  const isTooltipVisible = useCallback((id: string) => {
    return tooltips[id]?.visible || false;
  }, [tooltips]);

  const getTooltipMessage = useCallback((id: string) => {
    return tooltips[id]?.message || '';
  }, [tooltips]);

  const toggleTooltip = useCallback((id: string, message: string) => {
    if (isTooltipVisible(id)) {
      hideTooltip(id);
    } else {
      showTooltip(id, message);
    }
  }, [isTooltipVisible, hideTooltip, showTooltip]);

  const getVisibleTooltipCount = useCallback(() => {
    return Object.values(tooltips).filter(tooltip => tooltip.visible).length;
  }, [tooltips]);

  return {
    showTooltip,
    hideTooltip,
    hideAllTooltips,
    isTooltipVisible,
    getTooltipMessage,
    toggleTooltip,
    getVisibleTooltipCount,
  };
};

// Hook para tooltips com timer personalizado
export const useTimedErrorTooltip = (defaultDuration: number = 3000) => {
  const [state, setState] = useState<{
    isVisible: boolean;
    message: string;
    timeoutId: NodeJS.Timeout | null;
  }>({
    isVisible: false,
    message: '',
    timeoutId: null,
  });

  const clearTimer = useCallback(() => {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }
  }, [state.timeoutId]);

  const showTooltip = useCallback((message: string, duration?: number) => {
    clearTimer();
    
    const timeoutDuration = duration || defaultDuration;
    const timeoutId = setTimeout(() => {
      setState(prev => ({ ...prev, isVisible: false, timeoutId: null }));
    }, timeoutDuration);

    setState({
      isVisible: true,
      message,
      timeoutId,
    });
  }, [clearTimer, defaultDuration]);

  const hideTooltip = useCallback(() => {
    clearTimer();
    setState({
      isVisible: false,
      message: '',
      timeoutId: null,
    });
  }, [clearTimer]);

  const extendTimer = useCallback((additionalTime: number = 1000) => {
    if (state.isVisible && state.timeoutId) {
      clearTimer();
      const timeoutId = setTimeout(() => {
        setState(prev => ({ ...prev, isVisible: false, timeoutId: null }));
      }, additionalTime);
      
      setState(prev => ({ ...prev, timeoutId }));
    }
  }, [state.isVisible, state.timeoutId, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    isVisible: state.isVisible,
    message: state.message,
    showTooltip,
    hideTooltip,
    extendTimer,
  };
};