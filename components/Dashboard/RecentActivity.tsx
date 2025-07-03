import React from 'react';
import { formatDate, formatCurrency } from '../../lib/api';
import { Inscricao } from '../../types';
import { Calendar, User, DollarSign } from 'lucide-react';

interface RecentActivityProps {
  inscricoes: Inscricao[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ inscricoes }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      CONFIRMADA: { color: 'bg-green-100 text-green-800', label: 'Confirmada' },
      PENDENTE: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      CANCELADA: { color: 'bg-red-100 text-red-800', label: 'Cancelada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDENTE;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (!inscricoes || inscricoes.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Nenhuma atividade recente</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inscricoes.map((inscricao) => (
        <div 
          key={inscricao.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="font-medium text-gray-900">{inscricao.nomeCompleto}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{inscricao.excursao.titulo}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCurrency(inscricao.valorTotal)} • {inscricao.quantidadePessoas} pessoa{inscricao.quantidadePessoas > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="text-right">
            {getStatusBadge(inscricao.status)}
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(inscricao.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;

