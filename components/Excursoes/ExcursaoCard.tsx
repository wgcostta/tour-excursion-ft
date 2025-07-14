import React from 'react';
import Image from 'next/image';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Excursao } from '../../types';
import { formatCurrency, formatDate } from '../../lib/api';

interface ExcursaoCardProps {
  excursao: Excursao;
  onClick: () => void;
}

const ExcursaoCard: React.FC<ExcursaoCardProps> = ({ excursao, onClick }) => {
  const isDisponivel = excursao.status === 'ATIVA' && excursao.vagasDisponiveis > 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48">
        {excursao.imagens && excursao.imagens.length > 0 ? (
          <Image
            src={excursao.imagens[0]}
            alt={excursao.titulo}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isDisponivel
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isDisponivel ? 'Disponível' : 'Esgotado'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {excursao.titulo}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{excursao.localDestino}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(excursao.dataSaida)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{excursao.vagasDisponiveis} vagas disponíveis</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(excursao.preco)}
            </span>
          </div>
          
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDisponivel
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isDisponivel}
          >
            {isDisponivel ? 'Ver Detalhes' : 'Indisponível'}
          </button>
        </div>

        {/* Organizer */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Organizado por <span className="font-medium">{excursao.organizador.nomeEmpresa}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcursaoCard;

