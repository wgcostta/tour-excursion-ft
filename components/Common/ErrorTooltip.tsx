import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorTooltipProps {
  message?: string;
  isVisible: boolean;
  onClose: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({
  message,
  isVisible,
  onClose,
  position = 'bottom',
  className = '',
  children
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
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-red-600';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-red-600';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-red-600';
      default: // bottom
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-red-600';
    }
  };

  if (!isVisible && !isAnimating) return null;

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
          <div className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`} />
          
          {/* Tooltip content */}
          <div className="bg-red-600 text-white text-sm rounded-lg shadow-lg p-3 max-w-xs min-w-48">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white">{message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="flex-shrink-0 text-white hover:text-red-200 transition-colors duration-200"
                aria-label="Fechar tooltip de erro"
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