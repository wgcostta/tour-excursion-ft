import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ExcursaoCard from '../../components/Excursoes/ExcursaoCard';
import ExcursaoFilters from '../../components/Excursoes/ExcursaoFilters';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { excursoesService } from '../../lib/api';
import { Excursao } from '../../types';
import toast from 'react-hot-toast';

const ExcursoesPage: React.FC = () => {
  const router = useRouter();
  const [excursoes, setExcursoes] = useState<Excursao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    destino: '',
    precoMin: '',
    precoMax: '',
    dataInicio: '',
    dataFim: '',
    status: 'ATIVA',
  });

  useEffect(() => {
    loadExcursoes();
  }, [filters]);

  const loadExcursoes = async () => {
    try {
      setLoading(true);
      const response = await excursoesService.listarExcursoes({
        ...filters,
        search: searchTerm,
      });
      setExcursoes(response.data.content || []);
    } catch (error) {
      toast.error('Erro ao carregar excursões');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadExcursoes();
  };

  const filteredExcursoes = excursoes.filter(excursao =>
    excursao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    excursao.destino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout 
      title="Excursões Disponíveis"
      description="Encontre a excursão perfeita para sua próxima aventura"
    >
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por destino ou título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </button>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <ExcursaoFilters
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredExcursoes.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredExcursoes.length} excursões encontradas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExcursoes.map((excursao) => (
                <ExcursaoCard
                  key={excursao.id}
                  excursao={excursao}
                  onClick={() => router.push(`/excursoes/${excursao.id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma excursão encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  destino: '',
                  precoMin: '',
                  precoMax: '',
                  dataInicio: '',
                  dataFim: '',
                  status: 'ATIVA',
                });
              }}
              className="btn-primary"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExcursoesPage;

