import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const ExcursaoCard = ({ excursao, isPublic = false }) => {
  const baseUrl = isPublic ? '/excursoes' : '/organizador/excursoes';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Imagem */}
      <div className="relative h-48 w-full">
        {excursao.imagens && excursao.imagens.length > 0 ? (
          <Image
            src={excursao.imagens[0]}
            alt={excursao.titulo}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            excursao.status === 'ATIVA' 
              ? 'bg-green-100 text-green-800'
              : excursao.status === 'SUSPENSA'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {excursao.status}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {excursao.titulo}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {excursao.descricao}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateTime(excursao.dataSaida)}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {excursao.localSaida} → {excursao.localDestino}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(excursao.preco)}
            </span>
            
            <span className="text-sm text-gray-500">
              {excursao.vagasDisponiveis}/{excursao.vagasTotal} vagas
            </span>
          </div>
        </div>

        {/* Métodos de pagamento */}
        <div className="flex items-center space-x-2 mb-4">
          {excursao.aceitaPix && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              PIX
            </span>
          )}
          {excursao.aceitaCartao && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              Cartão
            </span>
          )}
        </div>

        {/* Ações */}
        <div className="flex space-x-2">
          <Link
            href={`${baseUrl}/${excursao.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Detalhes
          </Link>
          
          {!isPublic && (
            <Link
              href={`/organizador/excursoes/${excursao.id}/editar`}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Editar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcursaoCard;

