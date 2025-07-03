// components/Excursoes/ExcursaoForm.tsx (Updated)
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TourRequest, TourStatus, TourResponse } from '../types/tour';
import { Save, X, AlertCircle } from 'lucide-react';
import ErrorTooltip from './Common/ErrorTooltip';
import { useFormErrorTooltip } from '../hooks/useErrorTooltip';

interface TourFormProps {
  tour?: TourResponse;
  onSubmit: (data: TourRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface ApiValidationError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  validationErrors: Record<string, string>;
}

const TourForm: React.FC<TourFormProps> = ({ tour, onSubmit, onCancel, isLoading }) => {
  const [globalError, setGlobalError] = useState<string>('');
  const { 
    showFieldError, 
    hideFieldError, 
    clearAllErrors, 
    isFieldErrorVisible, 
    getFieldError 
  } = useFormErrorTooltip();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setError,
    clearErrors
  } = useForm<TourRequest>({
    defaultValues: tour ? {
      name: tour.name,
      description: tour.description,
      destination: tour.destination,
      price: tour.price,
      durationDays: tour.durationDays,
      maxParticipants: tour.maxParticipants,
      status: tour.status,
      startDate: tour.startDate.split('T')[0],
      endDate: tour.endDate.split('T')[0]
    } : {
      status: TourStatus.DRAFT
    }
  });

  const handleFormSubmit = async (data: TourRequest) => {
    try {
      // Limpar erros anteriores
      setGlobalError('');
      clearErrors();
      clearAllErrors();

      await onSubmit(data);
    } catch (error: any) {
      console.error('Erro ao salvar tour:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data as ApiValidationError;
        
        // Se há erros de validação específicos por campo
        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;
          
          // Definir erros nos campos do react-hook-form e mostrar tooltips
          Object.entries(validationErrors).forEach(([field, message]) => {
            setError(field as keyof TourRequest, {
              type: 'server',
              message: message
            });
            
            // Mostrar tooltip de erro para o campo
            showFieldError(field, message);
          });
        } else {
          // Erro geral
          setGlobalError(errorData.message || 'Erro ao salvar tour');
        }
      } else {
        setGlobalError('Erro inesperado ao salvar tour');
      }
    }
  };

  const getErrorMessage = (fieldName: keyof TourRequest) => {
    // Prioriza erro do react-hook-form, depois erro da API
    return errors[fieldName]?.message || getFieldError(fieldName);
  };

  const hasFieldError = (fieldName: keyof TourRequest) => {
    return !!(errors[fieldName] || isFieldErrorVisible(fieldName));
  };

  const handleFieldFocus = (fieldName: keyof TourRequest) => {
    const errorMessage = getErrorMessage(fieldName);
    if (errorMessage) {
      showFieldError(fieldName, errorMessage);
    }
  };

  const handleFieldBlur = (fieldName: keyof TourRequest) => {
    // Não esconder imediatamente para permitir interação com o tooltip
    setTimeout(() => {
      hideFieldError(fieldName);
    }, 150);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {tour ? 'Editar Tour' : 'Novo Tour'}
      </h2>
      
      {/* Erro global */}
      {globalError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Erro ao salvar</h3>
              <p className="text-sm text-red-700 mt-1">{globalError}</p>
            </div>
            <button
              onClick={() => setGlobalError('')}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Tour *
            </label>
            <ErrorTooltip
              message={getErrorMessage('name')}
              isVisible={isFieldErrorVisible('name')}
              onClose={() => hideFieldError('name')}
              position="bottom"
            >
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                onFocus={() => handleFieldFocus('name')}
                onBlur={() => handleFieldBlur('name')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                  hasFieldError('name')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino *
            </label>
            <ErrorTooltip
              message={getErrorMessage('destination')}
              isVisible={isFieldErrorVisible('destination')}
              onClose={() => hideFieldError('destination')}
              position="bottom"
            >
              <input
                type="text"
                {...register('destination', { required: 'Destino é obrigatório' })}
                onFocus={() => handleFieldFocus('destination')}
                onBlur={() => handleFieldBlur('destination')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                  hasFieldError('destination')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <ErrorTooltip
            message={getErrorMessage('description')}
            isVisible={isFieldErrorVisible('description')}
            onClose={() => hideFieldError('description')}
            position="bottom"
          >
            <textarea
              {...register('description', { 
                required: 'Descrição é obrigatória',
                minLength: { value: 10, message: 'Descrição deve ter pelo menos 10 caracteres' },
                maxLength: { value: 1000, message: 'Descrição deve ter no máximo 1000 caracteres' }
              })}
              onFocus={() => handleFieldFocus('description')}
              onBlur={() => handleFieldBlur('description')}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('description')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Descreva o tour detalhadamente (mínimo 10 caracteres)"
            />
          </ErrorTooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <ErrorTooltip
              message={getErrorMessage('price')}
              isVisible={isFieldErrorVisible('price')}
              onClose={() => hideFieldError('price')}
              position="bottom"
            >
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço deve ser positivo' }
                })}
                onFocus={() => handleFieldFocus('price')}
                onBlur={() => handleFieldBlur('price')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                  hasFieldError('price')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (dias) *
            </label>
            <ErrorTooltip
              message={getErrorMessage('durationDays')}
              isVisible={isFieldErrorVisible('durationDays')}
              onClose={() => hideFieldError('durationDays')}
              position="bottom"
            >
              <input
                type="number"
                {...register('durationDays', { 
                  required: 'Duração é obrigatória',
                  min: { value: 1, message: 'Duração deve ser pelo menos 1 dia' }
                })}
                onFocus={() => handleFieldFocus('durationDays')}
                onBlur={() => handleFieldBlur('durationDays')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                  hasFieldError('durationDays')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máx. Participantes *
            </label>
            <ErrorTooltip
              message={getErrorMessage('maxParticipants')}
              isVisible={isFieldErrorVisible('maxParticipants')}
              onClose={() => hideFieldError('maxParticipants')}
              position="bottom"
            >
              <input
                type="number"
                {...register('maxParticipants', { 
                  required: 'Máximo de participantes é obrigatório',
                  min: { value: 1, message: 'Deve ser pelo menos 1 participante' }
                })}
                onFocus={() => handleFieldFocus('maxParticipants')}
                onBlur={() => handleFieldBlur('maxParticipants')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                  hasFieldError('maxParticipants')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <ErrorTooltip
              message={getErrorMessage('status')}
              isVisible={isFieldErrorVisible('status')}
              onClose={() => hideFieldError('status')}
              position="bottom"
            >
              <select
                {...register('status', { required: 'Status é obrigatório' })}
                onFocus={() => handleFieldFocus('status')}
                onBlur={() => handleFieldBlur('status')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  hasFieldError('status')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value={TourStatus.DRAFT}>Rascunho</option>
                <option value={TourStatus.ACTIVE}>Ativo</option>
                <option value={TourStatus.FULL}>Lotado</option>
                <option value={TourStatus.CANCELLED}>Cancelado</option>
                <option value={TourStatus.COMPLETED}>Concluído</option>
              </select>
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início *
            </label>
            <ErrorTooltip
              message={getErrorMessage('startDate')}
              isVisible={isFieldErrorVisible('startDate')}
              onClose={() => hideFieldError('startDate')}
              position="bottom"
            >
              <input
                type="date"
                {...register('startDate', { required: 'Data de início é obrigatória' })}
                onFocus={() => handleFieldFocus('startDate')}
                onBlur={() => handleFieldBlur('startDate')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  hasFieldError('startDate')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim *
            </label>
            <ErrorTooltip
              message={getErrorMessage('endDate')}
              isVisible={isFieldErrorVisible('endDate')}
              onClose={() => hideFieldError('endDate')}
              position="bottom"
            >
              <input
                type="date"
                {...register('endDate', { required: 'Data de fim é obrigatória' })}
                onFocus={() => handleFieldFocus('endDate')}
                onBlur={() => handleFieldBlur('endDate')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                  hasFieldError('endDate')
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
            </ErrorTooltip>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 flex items-center space-x-2"
          >
            <X size={16} />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{isLoading ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TourForm;