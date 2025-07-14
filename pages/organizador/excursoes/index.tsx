import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ExcursaoCard from '../../../components/Excursoes/ExcursaoCard';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import { 
  Plus, 
  Filter, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react';
import { excursoesService, formatCurrency, formatDate } from '../../../lib/api';
import { Excursao } from '../../../types';
import toast from 'react-hot-toast';

const OrganizadorExcursoesPage: React.FC = () => {
  const router = useRouter();
  const [excursoes, setExcursoes] = useState<Excursao[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [excursaoToDelete, setExcursaoToDelete] = useState<string>('');

  useEffect(() => {
    loadExcursoes();
  }, [statusFilter]);

  const loadExcursoes = async () => {
    try {
      setLoading(true);
      const response = await excursoesService.listarExcursoes({
        status: statusFilter || undefined,
      });
      setExcursoes(response.data.content || []);
    } catch (error) {
      toast.error('Erro ao carregar excursões');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExcursao = async () => {
    try {
      await excursoesService.excluirExcursao(excursaoToDelete);
      toast.success('Excursão excluída com sucesso!');
      loadExcursoes();
    } catch (error) {
      toast.error('Erro ao excluir excursão');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await excursoesService.alterarStatus(id, status);
      toast.success('Status atualizado com sucesso!');
      loadExcursoes();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const filteredExcursoes = excursoes.filter(excursao =>
    excursao.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    excursao.localDestino.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ATIVA: { color: 'bg-green-100 text-green-800', label: 'Ativa' },
      INATIVA: { color: 'bg-gray-100 text-gray-800', label: 'Inativa' },
      CANCELADA: { color: 'bg-red-100 text-red-800', label: 'Cancelada' },
      FINALIZADA: { color: 'bg-blue-100 text-blue-800', label: 'Finalizada' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ATIVA;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Layout 
      showSidebar={true}
      title="Minhas Excursões"
      description="Gerencie suas excursões"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar excursões..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input w-auto"
            >
              <option value="">Todos os status</option>
              <option value="ATIVA">Ativa</option>
              <option value="INATIVA">Inativa</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </div>

          <button
            onClick={() => router.push('/organizador/excursoes/nova')}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Excursão
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="card p-6 animate-pulse">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExcursoes.map((excursao) => (
                <div key={excursao.id} className="card overflow-hidden">
                  {/* Image */}
                  <div className="relative h-48">
                    {excursao.imagens && excursao.imagens.length > 0 ? (
                      <img
                        src={excursao.imagens[0]}
                        alt={excursao.titulo}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(excursao.status)}
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3">
                      <div className="relative group">
                        <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                          <MoreVertical className="h-4 w-4 text-gray-600" />
                        </button>
                        
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button
                            onClick={() => router.push(`/excursoes/${excursao.id}`)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </button>
                          
                          <button
                            onClick={() => router.push(`/organizador/excursoes/${excursao.id}/editar`)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </button>

                          {excursao.status === 'ATIVA' && (
                            <button
                              onClick={() => handleStatusChange(excursao.id, 'INATIVA')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Desativar
                            </button>
                          )}

                          {excursao.status === 'INATIVA' && (
                            <button
                              onClick={() => handleStatusChange(excursao.id, 'ATIVA')}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Ativar
                            </button>
                          )}
                          
                          <div className="border-t border-gray-100 my-1"></div>
                          
                          <button
                            onClick={() => {
                              setExcursaoToDelete(excursao.id);
                              setShowDeleteDialog(true);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </button>
                        </div>
                      </div>
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
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {excursao.vagasDisponiveis}
                        </div>
                        <div className="text-xs text-gray-600">Vagas</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {excursao.vagasTotal - excursao.vagasDisponiveis}
                        </div>
                        <div className="text-xs text-gray-600">Inscritos</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary-600">
                          {formatCurrency(excursao.preco)}
                        </div>
                        <div className="text-xs text-gray-600">Preço</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/organizador/excursoes/${excursao.id}`)}
                        className="btn-outline flex-1 text-sm"
                      >
                        Ver Detalhes
                      </button>
                      <button
                        onClick={() => router.push(`/organizador/excursoes/${excursao.id}/editar`)}
                        className="btn-primary flex-1 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
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
              {searchTerm || statusFilter
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando sua primeira excursão.'}
            </p>
            {!searchTerm && !statusFilter && (
              <button
                onClick={() => router.push('/organizador/excursoes/nova')}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Excursão
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteExcursao}
        title="Excluir Excursão"
        message="Tem certeza que deseja excluir esta excursão? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        type="danger"
      />
    </Layout>
  );
};

export default OrganizadorExcursoesPage;

