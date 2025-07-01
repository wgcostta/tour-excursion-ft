// components/TourList.tsx
import React from 'react';
import { TourSummary, TourStatus } from '../types/tour';
import { Edit, Trash2, Eye, Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface TourListProps {
  tours: TourSummary[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  isLoading?: boolean;
}

const TourList: React.FC<TourListProps> = ({ tours, onEdit, onDelete, onView, isLoading }) => {
  const getStatusColor = (status: TourStatus) => {
    switch (status) {
      case TourStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case TourStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case TourStatus.FULL:
        return 'bg-yellow-100 text-yellow-800';
      case TourStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case TourStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: TourStatus) => {
    switch (status) {
      case TourStatus.ACTIVE:
        return 'Ativo';
      case TourStatus.DRAFT:
        return 'Rascunho';
      case TourStatus.FULL:
        return 'Lotado';
      case TourStatus.CANCELLED:
        return 'Cancelado';
      case TourStatus.COMPLETED:
        return 'Concluído';
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="h-3 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-gray-300 rounded w-20"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-300 rounded w-8"></div>
                <div className="h-8 bg-gray-300 rounded w-8"></div>
                <div className="h-8 bg-gray-300 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Nenhum tour encontrado</div>
        <p className="text-gray-400">Tente ajustar os filtros de busca</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{tour.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                {getStatusText(tour.status)}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{tour.destination}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">{tour.durationDays} dias</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span className="text-sm">Início: {formatDate(tour.startDate)}</span>
              </div>
              
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign size={16} className="mr-2" />
                <span>{formatPrice(tour.price)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(tour.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Visualizar"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => onEdit(tour.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => onDelete(tour.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TourList;