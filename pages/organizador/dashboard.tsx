// pages/organizador/dashboard.tsx - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DashboardStats from '../../components/Dashboard/DashboardStats';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import QuickActions from '../../components/Dashboard/QuickActions';
import ClientOnly from '../../components/ClientOnly';
import SafeDate from '../../components/SafeDate';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign,
  Calendar,
  AlertCircle,
  Eye,
  Edit,
  Plus,
  BarChart3
} from 'lucide-react';
import { organizadorService, formatCurrency } from '../../lib/api';
import { DashboardData, Excursao } from '../../types';
import toast from 'react-hot-toast';

const OrganizadorDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    dataInicio: '',
    dataFim: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.userType !== 'ORGANIZADOR') {
      router.push('/');
      return;
    }

    loadDashboardData();
  }, [session, status, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await organizadorService.getDashboard(
        dateRange.dataInicio || undefined,
        dateRange.dataFim || undefined
      );
      setDashboardData(response.data.data);
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = () => {
    if (dateRange.dataInicio && dateRange.dataFim) {
      if (new Date(dateRange.dataInicio) > new Date(dateRange.dataFim)) {
        toast.error('Data de início não pode ser maior que data de fim');
        return;
      }
    }
    loadDashboardData();
  };

  const clearDateRange = () => {
    setDateRange({ dataInicio: '', dataFim: '' });
    setTimeout(() => loadDashboardData(), 100);
  };

  // Render skeleton while loading to prevent hydration issues
  if (status === 'loading' || loading) {
    return (
      <Layout showSidebar={true} userType="ORGANIZADOR" title="Dashboard">
        <div className="animate-pulse space-y-6">
          {/* Welcome Message Skeleton */}
          <div className="h-24 bg-gray-300 rounded-lg"></div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          
          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      title: 'Total de Excursões',
      value: dashboardData?.totalExcursoes || 0,
      icon: MapPin,
      color: 'blue',
      change: `+${dashboardData?.excursoesMes || 0} este mês`,
      changeType: 'positive' as const,
    },
    {
      title: 'Excursões Ativas',
      value: dashboardData?.excursoesAtivas || 0,
      icon: Calendar,
      color: 'green',
      change: 'Disponíveis para inscrição',
      changeType: 'neutral' as const,
    },
    {
      title: 'Total de Inscrições',
      value: dashboardData?.totalInscricoes || 0,
      icon: Users,
      color: 'purple',
      change: `${dashboardData?.inscricoesPendentes || 0} pendentes`,
      changeType: dashboardData?.inscricoesPendentes ? 'negative' : 'neutral' as const,
    },
    {
      title: 'Receita Total',
      value: formatCurrency(dashboardData?.receitaTotal || 0),
      icon: DollarSign,
      color: 'emerald',
      change: `${formatCurrency(dashboardData?.receitaMes || 0)} este mês`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <Layout 
      showSidebar={true}
      userType="ORGANIZADOR"
      title="Dashboard - Organizador"
      description="Visão geral do seu negócio de excursões"
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo de volta, {session?.user?.name?.split(' ')[0]}!
              </h2>
              <p className="text-primary-100">
                Aqui está um resumo da atividade da sua empresa de excursões.
              </p>
            </div>
            <div className="hidden md:block">
              <BarChart3 className="h-16 w-16 text-primary-200" />
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="card p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Período de Análise</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">De:</label>
                <input
                  type="date"
                  value={dateRange.dataInicio}
                  onChange={(e) => setDateRange(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="form-input text-sm py-1 px-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Até:</label>
                <input
                  type="date"
                  value={dateRange.dataFim}
                  onChange={(e) => setDateRange(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="form-input text-sm py-1 px-2"
                />
              </div>
              <button
                onClick={handleDateRangeChange}
                className="btn-primary text-sm py-1 px-3"
                disabled={loading}
              >
                Filtrar
              </button>
              {(dateRange.dataInicio || dateRange.dataFim) && (
                <button
                  onClick={clearDateRange}
                  className="btn-outline text-sm py-1 px-3"
                  disabled={loading}
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid - Wrapped in ClientOnly */}
        <ClientOnly
          fallback={
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="xl:col-span-1 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          }
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="xl:col-span-2">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="section-title">Atividade Recente</h3>
                  <button
                    onClick={() => router.push('/organizador/inscricoes')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Ver todas →
                  </button>
                </div>
                {dashboardData?.inscricoesRecentes && dashboardData.inscricoesRecentes.length > 0 ? (
                  <RecentActivity inscricoes={dashboardData.inscricoesRecentes} />
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Nenhuma atividade recente</p>
                    <p className="text-sm text-gray-500">As novas inscrições aparecerão aqui</p>
                  </div>
                )}
              </div>
            </div>

            {/* Próximas Excursões */}
            <div className="xl:col-span-1">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="section-title">Próximas Excursões</h3>
                  <button
                    onClick={() => router.push('/organizador/excursoes')}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Ver todas →
                  </button>
                </div>
                {dashboardData?.proximasExcursoes && dashboardData.proximasExcursoes.length > 0 ? (
                  <div className="space-y-3">
                    {dashboardData.proximasExcursoes.slice(0, 4).map((excursao: Excursao) => (
                      <div 
                        key={excursao.id}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/organizador/excursoes/${excursao.id}`)}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600">
                            {excursao.titulo}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">{excursao.localDestino}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <SafeDate date={excursao.dataSaida} format="date" />
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-xs font-medium text-gray-900">
                            {excursao.vagasDisponiveis}/{excursao.vagasTotal}
                          </div>
                          <div className={`text-xs ${
                            excursao.status === 'ATIVA' ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {excursao.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Nenhuma excursão agendada</p>
                    <button
                      onClick={() => router.push('/organizador/excursoes/nova')}
                      className="btn-primary text-sm mt-3"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Criar Nova Excursão
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ClientOnly>

        {/* Additional Metrics - Also wrapped in ClientOnly */}
        <ClientOnly
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          }
        >
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {dashboardData.clientesUnicos || 0}
                </div>
                <div className="text-sm text-gray-600">Clientes Únicos</div>
                <div className="text-xs text-gray-500 mt-1">
                  Total de clientes cadastrados
                </div>
              </div>
              
              <div className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(dashboardData.ticketMedio || 0)}
                </div>
                <div className="text-sm text-gray-600">Ticket Médio</div>
                <div className="text-xs text-gray-500 mt-1">
                  Valor médio por excursão
                </div>
              </div>
              
              <div className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {Math.round((dashboardData.taxaOcupacaoMedia || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Taxa de Ocupação</div>
                <div className="text-xs text-gray-500 mt-1">
                  Média de vagas ocupadas
                </div>
              </div>

              <div className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {dashboardData.notificacoesEnviadas || 0}
                </div>
                <div className="text-sm text-gray-600">Notificações</div>
                <div className="text-xs text-gray-500 mt-1">
                  Total enviadas
                </div>
              </div>
            </div>
          )}
        </ClientOnly>

        {/* Rest of the component remains the same... */}
        {/* Performance Insights, Alerts etc. */}
      </div>
    </Layout>
  );
};

export default OrganizadorDashboard;