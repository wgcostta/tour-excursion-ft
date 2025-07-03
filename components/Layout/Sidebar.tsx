import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Map, 
  Users, 
  CreditCard, 
  Bell, 
  Settings, 
  User,
  Calendar,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  userType?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const router = useRouter();

  const organizadorMenuItems = [
    { href: '/organizador/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/organizador/excursoes', icon: Map, label: 'Excursões' },
    { href: '/organizador/inscricoes', icon: Users, label: 'Inscrições' },
    { href: '/organizador/pagamentos', icon: CreditCard, label: 'Pagamentos' },
    { href: '/organizador/notificacoes', icon: Bell, label: 'Notificações' },
    { href: '/organizador/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/organizador/perfil', icon: User, label: 'Perfil' },
    { href: '/organizador/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const clienteMenuItems = [
    { href: '/cliente/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/cliente/inscricoes', icon: Calendar, label: 'Minhas Inscrições' },
    { href: '/cliente/perfil', icon: User, label: 'Meu Perfil' },
    { href: '/cliente/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  const menuItems = userType === 'ORGANIZADOR' ? organizadorMenuItems : clienteMenuItems;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

