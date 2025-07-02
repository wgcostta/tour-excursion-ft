import React from 'react';
import { useRouter } from 'next/router';
import { Plus, Users, BarChart3, Bell, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const router = useRouter();

  const actions = [
    {
      title: 'Nova Excursão',
      description: 'Criar uma nova excursão',
      icon: Plus,
      color: 'bg-primary-600 hover:bg-primary-700',
      href: '/organizador/excursoes/nova',
    },
    {
      title: 'Ver Inscrições',
      description: 'Gerenciar inscrições',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      href: '/organizador/inscricoes',
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios',
      icon: BarChart3,
      color: 'bg-purple-600 hover:bg-purple-700',
      href: '/organizador/relatorios',
    },
    {
      title: 'Notificações',
      description: 'Enviar notificações',
      icon: Bell,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      href: '/organizador/notificacoes',
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="section-title">Ações Rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => router.push(action.href)}
              className={`p-4 rounded-lg text-white text-left transition-colors ${action.color}`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <h4 className="font-medium mb-1">{action.title}</h4>
              <p className="text-sm opacity-90">{action.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;

