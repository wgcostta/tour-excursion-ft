// components/Common/ErrorTooltip.tsx
import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorTooltipProps {
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
  type?: 'error' | 'warning' | 'info';
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({
  message,
  isVisible,
  onClose,
  position = 'bottom',
  className = '',
  children,
  type = 'error'
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default: // bottom
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = () => {
    const baseArrowSize = 'w-0 h-0 border-4';
    
    switch (position) {
      case 'top':
        return `${baseArrowSize} top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent ${getArrowColor()}`;
      case 'left':
        return `${baseArrowSize} left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent ${getArrowColor()}`;
      case 'right':
        return `${baseArrowSize} right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent ${getArrowColor()}`;
      default: // bottom
        return `${baseArrowSize} bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent ${getArrowColor()}`;
    }
  };

  const getArrowColor = () => {
    switch (type) {
      case 'warning':
        return 'border-t-yellow-600 border-b-yellow-600 border-l-yellow-600 border-r-yellow-600';
      case 'info':
        return 'border-t-blue-600 border-b-blue-600 border-l-blue-600 border-r-blue-600';
      default: // error
        return 'border-t-red-600 border-b-red-600 border-l-red-600 border-r-red-600';
    }
  };

  const getTooltipColors = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default: // error
        return 'bg-red-600 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />;
    }
  };

  if (!isVisible && !isAnimating) return children ? <>{children}</> : null;

  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${getPositionClasses()} ${
            isAnimating ? 'animate-fadeIn' : ''
          }`}
          role="tooltip"
          aria-live="polite"
        >
          {/* Arrow */}
          <div className={`absolute ${getArrowClasses()}`} />
          
          {/* Tooltip content */}
          <div className={`${getTooltipColors()} text-sm rounded-lg shadow-lg p-3 max-w-xs min-w-48`}>
            <div className="flex items-start space-x-2">
              {getIcon()}
              <div className="flex-1">
                <p className="text-white">{message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-200 p-0.5 hover:bg-white hover:bg-opacity-20 rounded"
                aria-label="Fechar tooltip"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorTooltip;