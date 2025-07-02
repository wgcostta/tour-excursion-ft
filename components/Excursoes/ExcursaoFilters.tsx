import React from 'react';
import { X } from 'lucide-react';

interface Filters {
  destino: string;
  precoMin: string;
  precoMax: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

interface ExcursaoFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ExcursaoFilters: React.FC<ExcursaoFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      destino: '',
      precoMin: '',
      precoMax: '',
      dataInicio: '',
      dataFim: '',
      status: 'ATIVA',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value && value !== 'ATIVA');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destino */}
        <div>
          <label className="form-label">Destino</label>
          <input
            type="text"
            placeholder="Ex: Rio de Janeiro"
            value={filters.destino}
            onChange={(e) => handleFilterChange('destino', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Preço Mínimo */}
        <div>
          <label className="form-label">Preço Mínimo</label>
          <input
            type="number"
            placeholder="0"
            value={filters.precoMin}
            onChange={(e) => handleFilterChange('precoMin', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Preço Máximo */}
        <div>
          <label className="form-label">Preço Máximo</label>
          <input
            type="number"
            placeholder="1000"
            value={filters.precoMax}
            onChange={(e) => handleFilterChange('precoMax', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Status */}
        <div>
          <label className="form-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="form-input"
          >
            <option value="">Todos</option>
            <option value="ATIVA">Disponível</option>
            <option value="INATIVA">Indisponível</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        {/* Data Início */}
        <div>
          <label className="form-label">Data Inicial</label>
          <input
            type="date"
            value={filters.dataInicio}
            onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label className="form-label">Data Final</label>
          <input
            type="date"
            value={filters.dataFim}
            onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default ExcursaoFilters;

