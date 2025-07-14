import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  Star,
  Compass
} from 'lucide-react';
import { clienteService, formatCurrency, formatDate } from '../../lib/api';
import { Inscricao } from '../../types';
import toast from 'react-hot-toast';

const ClienteDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inscricoes, setInscricoes] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.userType !== 'CLIENTE') {
      router.push('/');
      return;
    }

    loadInscricoes();
  }, [session, status]);

  const loadInscricoes = async () => {
    try {
      setLoading(true);
      const response = await clienteService.getInscricoes({ size: 10 });
      setInscricoes(response.data.content || []);
    } catch (error) {
      toast.error('Erro ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  };

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

  if (status === 'loading' || loading) {
    return (
      <Layout showSidebar={true}>
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const inscricoesConfirmadas = inscricoes.filter(i => i.status === 'CONFIRMADA');
  const inscricoesPendentes = inscricoes.filter(i => i.status === 'PENDENTE');
  const proximasViagens = inscricoesConfirmadas
    .filter(i => new Date(i.excursao.dataSaida) > new Date())
    .sort((a, b) => new Date(a.excursao.dataSaida).getTime() - new Date(b.excursao.dataSaida).getTime());

  return (
    <Layout 
      showSidebar={true}
      title="Meu Dashboard"
      description="Acompanhe suas excursões e viagens"
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Olá, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-primary-100">
            Pronto para sua próxima aventura? Veja suas excursões aqui.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Excursões</p>
                <p className="text-2xl font-bold text-gray-900">{inscricoes.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                <p className="text-2xl font-bold text-gray-900">{inscricoesConfirmadas.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{inscricoesPendentes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas Viagens */}
          <div className="card p-6">
            <h3 className="section-title">Próximas Viagens</h3>
            {proximasViagens.length > 0 ? (
              <div className="space-y-4">
                {proximasViagens.slice(0, 3).map((inscricao) => (
                  <div 
                    key={inscricao.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/excursoes/${inscricao.excursao.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {inscricao.excursao.titulo}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{inscricao.excursao.localDestino}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(inscricao.excursao.dataSaida)}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>
                            {new Date(inscricao.excursao.dataSaida).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(inscricao.status)}
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          {inscricao.quantidadePessoas} pessoa{inscricao.quantidadePessoas > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {proximasViagens.length > 3 && (
                  <button
                    onClick={() => router.push('/cliente/inscricoes')}
                    className="w-full text-center py-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Ver todas as viagens →
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Compass className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Nenhuma viagem agendada</p>
                <button
                  onClick={() => router.push('/excursoes')}
                  className="btn-primary"
                >
                  Explorar Excursões
                </button>
              </div>
            )}
          </div>

          {/* Histórico Recente */}
          <div className="card p-6">
            <h3 className="section-title">Histórico Recente</h3>
            {inscricoes.length > 0 ? (
              <div className="space-y-4">
                {inscricoes.slice(0, 5).map((inscricao) => (
                  <div key={inscricao.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {inscricao.excursao.titulo}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {formatDate(inscricao.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(inscricao.status)}
                      <div className="text-xs text-gray-600 mt-1">
                        {formatCurrency(inscricao.valorTotal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma inscrição ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/excursoes')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Compass className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Explorar Excursões</h3>
                <p className="text-sm text-gray-600">Descubra novos destinos</p>
              </div>
            </div>
          </div>

          <div 
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/cliente/inscricoes')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Minhas Inscrições</h3>
                <p className="text-sm text-gray-600">Gerencie suas viagens</p>
              </div>
            </div>
          </div>

          <div 
            className="card p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/cliente/perfil')}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">Meu Perfil</h3>
                <p className="text-sm text-gray-600">Atualizar informações</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments Alert */}
        {inscricoesPendentes.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Pagamentos Pendentes
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Você tem {inscricoesPendentes.length} inscrição{inscricoesPendentes.length > 1 ? 'ões' : ''} aguardando pagamento.
                </p>
                <button
                  onClick={() => router.push('/cliente/inscricoes?status=PENDENTE')}
                  className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  Ver inscrições pendentes →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ClienteDashboard;

