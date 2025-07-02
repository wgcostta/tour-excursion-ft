import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const getTypeClasses = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'btn-danger',
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        };
      default:
        return {
          icon: 'text-blue-600',
          button: 'btn-primary',
        };
    }
  };

  const typeClasses = getTypeClasses();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-full bg-gray-100 mr-4`}>
              <AlertTriangle className={`h-6 w-6 ${typeClasses.icon}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onClose}
              className="btn-outline"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`btn ${typeClasses.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

