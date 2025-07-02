import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import DashboardStats from '../../components/Dashboard/DashboardStats';
import RecentActivity from '../../components/Dashboard/RecentActivity';
import QuickActions from '../../components/Dashboard/QuickActions';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { organizadorService } from '../../lib/api';
import { DashboardData } from '../../types';
import toast from 'react-hot-toast';

const OrganizadorDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [session, status]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await organizadorService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Layout showSidebar={true}>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
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
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Excursões Ativas',
      value: dashboardData?.excursoesAtivas || 0,
      icon: Calendar,
      color: 'green',
      change: '+5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total de Inscrições',
      value: dashboardData?.totalInscricoes || 0,
      icon: Users,
      color: 'purple',
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      title: 'Receita Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(dashboardData?.receitaTotal || 0),
      icon: DollarSign,
      color: 'emerald',
      change: '+15%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <Layout 
      showSidebar={true}
      title="Dashboard"
      description="Visão geral do seu negócio"
    >
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Bem-vindo de volta, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-primary-100">
            Aqui está um resumo da atividade da sua empresa de excursões.
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="section-title">Atividade Recente</h3>
            <RecentActivity 
              inscricoes={dashboardData?.inscricoesRecentes || []}
            />
          </div>

          {/* Próximas Excursões */}
          <div className="card p-6">
            <h3 className="section-title">Próximas Excursões</h3>
            {dashboardData?.proximasExcursoes && dashboardData.proximasExcursoes.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.proximasExcursoes.slice(0, 5).map((excursao) => (
                  <div 
                    key={excursao.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/organizador/excursoes/${excursao.id}`)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{excursao.titulo}</h4>
                      <p className="text-sm text-gray-600">{excursao.destino}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(excursao.dataIda).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {excursao.vagasDisponiveis}/{excursao.vagasTotal} vagas
                      </div>
                      <div className={`text-sm ${
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
                <p className="text-gray-600">Nenhuma excursão agendada</p>
                <button
                  onClick={() => router.push('/organizador/excursoes/nova')}
                  className="btn-primary mt-3"
                >
                  Criar Nova Excursão
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {dashboardData && (
          <div className="space-y-4">
            {dashboardData.excursoesAtivas === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">
                    Nenhuma excursão ativa
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Crie novas excursões para começar a receber inscrições.
                  </p>
                </div>
              </div>
            )}

            {dashboardData.inscricoesConfirmadas === 0 && dashboardData.totalInscricoes > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Inscrições pendentes de confirmação
                  </h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Você tem inscrições aguardando confirmação de pagamento.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrganizadorDashboard;

