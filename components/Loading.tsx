// components/Loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Carregando...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
          <p className={`${textSizeClasses[size]} text-gray-700 font-medium`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      <p className={`${textSizeClasses[size]} text-gray-600`}>
        {text}
      </p>
    </div>
  );
};

export default Loading;