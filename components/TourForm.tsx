// components/TourForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TourRequest, TourStatus, TourResponse } from '../types/tour';
import { Save, X, AlertCircle } from 'lucide-react';

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
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string>('');

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
      setApiErrors({});
      setGlobalError('');
      clearErrors();

      await onSubmit(data);
    } catch (error: any) {
      console.error('Erro ao salvar tour:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data as ApiValidationError;
        
        // Se há erros de validação específicos por campo
        if (errorData.validationErrors) {
          const validationErrors = errorData.validationErrors;
          setApiErrors(validationErrors);
          
          // Definir erros nos campos do react-hook-form também
          Object.entries(validationErrors).forEach(([field, message]) => {
            setError(field as keyof TourRequest, {
              type: 'server',
              message: message
            });
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

  const getFieldError = (fieldName: keyof TourRequest) => {
    // Prioriza erro do react-hook-form, depois erro da API
    return errors[fieldName]?.message || apiErrors[fieldName];
  };

  const hasFieldError = (fieldName: keyof TourRequest) => {
    return !!(errors[fieldName] || apiErrors[fieldName]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {tour ? 'Editar Tour' : 'Novo Tour'}
      </h2>
      
      {/* Erro global */}
      {globalError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Erro ao salvar</h3>
              <p className="text-sm text-red-700 mt-1">{globalError}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Tour *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('name')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('name') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('name')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino *
            </label>
            <input
              type="text"
              {...register('destination', { required: 'Destino é obrigatório' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('destination')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('destination') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('destination')}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            {...register('description', { 
              required: 'Descrição é obrigatória',
              minLength: { value: 10, message: 'Descrição deve ter pelo menos 10 caracteres' },
              maxLength: { value: 1000, message: 'Descrição deve ter no máximo 1000 caracteres' }
            })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-vertical text-gray-900 bg-white placeholder-gray-500 ${
              hasFieldError('description')
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Descreva o tour detalhadamente (mínimo 10 caracteres)"
          />
          {getFieldError('description') && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {getFieldError('description')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { 
                required: 'Preço é obrigatório',
                min: { value: 0, message: 'Preço deve ser positivo' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('price')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('price') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('price')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (dias) *
            </label>
            <input
              type="number"
              {...register('durationDays', { 
                required: 'Duração é obrigatória',
                min: { value: 1, message: 'Duração deve ser pelo menos 1 dia' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('durationDays')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('durationDays') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('durationDays')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máx. Participantes *
            </label>
            <input
              type="number"
              {...register('maxParticipants', { 
                required: 'Máximo de participantes é obrigatório',
                min: { value: 1, message: 'Deve ser pelo menos 1 participante' }
              })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white placeholder-gray-500 ${
                hasFieldError('maxParticipants')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('maxParticipants') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('maxParticipants')}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              {...register('status', { required: 'Status é obrigatório' })}
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
            {getFieldError('status') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('status')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início *
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'Data de início é obrigatória' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                hasFieldError('startDate')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('startDate') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('startDate')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim *
            </label>
            <input
              type="date"
              {...register('endDate', { required: 'Data de fim é obrigatória' })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-gray-900 bg-white ${
                hasFieldError('endDate')
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {getFieldError('endDate') && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {getFieldError('endDate')}
              </p>
            )}
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