// components/TourForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { TourRequest, TourStatus, TourResponse } from '../types/tour';
import { Save, X } from 'lucide-react';

interface TourFormProps {
  tour?: TourResponse;
  onSubmit: (data: TourRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TourForm: React.FC<TourFormProps> = ({ tour, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TourRequest>({
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
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar tour:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {tour ? 'Editar Tour' : 'Novo Tour'}
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Tour *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Nome é obrigatório' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino *
            </label>
            <input
              type="text"
              {...register('destination', { required: 'Destino é obrigatório' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.destination && (
              <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            {...register('description', { required: 'Descrição é obrigatória' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.durationDays && (
              <p className="text-red-500 text-sm mt-1">{errors.durationDays.message}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.maxParticipants && (
              <p className="text-red-500 text-sm mt-1">{errors.maxParticipants.message}</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TourStatus.DRAFT}>Rascunho</option>
              <option value={TourStatus.ACTIVE}>Ativo</option>
              <option value={TourStatus.FULL}>Lotado</option>
              <option value={TourStatus.CANCELLED}>Cancelado</option>
              <option value={TourStatus.COMPLETED}>Concluído</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início *
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'Data de início é obrigatória' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim *
            </label>
            <input
              type="date"
              {...register('endDate', { required: 'Data de fim é obrigatória' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center space-x-2"
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