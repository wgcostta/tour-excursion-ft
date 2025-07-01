// components/SearchFilters.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { SearchFilters, TourStatus } from '../types/tour';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  popularDestinations?: string[];
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onClear, 
  popularDestinations = [] 
}) => {
  const { register, handleSubmit, reset, watch } = useForm<SearchFilters>();

  const handleFormSubmit = (data: SearchFilters) => {
    // Remove campos vazios
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        acc[key as keyof SearchFilters] = value;
      }
      return acc;
    }, {} as SearchFilters);
    
    onSearch(cleanData);
  };

  const handleClear = () => {
    reset();
    onClear();
  };

  const watchedValues = watch();
  const hasFilters = Object.values(watchedValues).some(value => 
    value !== '' && value !== undefined && value !== null
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtros de Busca</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Tour
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Buscar por nome..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino
            </label>
            <input
              type="text"
              {...register('destination')}
              placeholder="Buscar por destino..."
              list="destinations"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="destinations">
              {popularDestinations.map((destination) => (
                <option key={destination} value={destination} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os status</option>
              <option value={TourStatus.DRAFT}>Rascunho</option>
              <option value={TourStatus.ACTIVE}>Ativo</option>
              <option value={TourStatus.FULL}>Lotado</option>
              <option value={TourStatus.CANCELLED}>Cancelado</option>
              <option value={TourStatus.COMPLETED}>Concluído</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço Mínimo (R$)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('minPrice')}
              placeholder="0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço Máximo (R$)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('maxPrice')}
              placeholder="9999,99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração Mínima (dias)
            </label>
            <input
              type="number"
              {...register('minDays')}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração Máxima (dias)
            </label>
            <input
              type="number"
              {...register('maxDays')}
              placeholder="365"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus