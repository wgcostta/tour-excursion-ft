import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  MapPin,
  Bell,
  Search
} from 'lucide-react';

const Header: React.FC = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const isOrganizador = session?.userType === 'ORGANIZADOR';
  const isCliente = session?.userType === 'CLIENTE';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 rounded-lg p-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TourApp</span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/excursoes" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Excursões
            </Link>
            
            {!session && (
              <>
                <Link href="/sobre" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Sobre
                </Link>
                <Link href="/contato" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                  Contato
                </Link>
              </>
            )}

            {session && (
              <>
                {isOrganizador && (
                  <Link href="/organizador/dashboard" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                
                {isCliente && (
                  <Link href="/cliente/inscricoes" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    Minhas Inscrições
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="Profile" width={32} height={32} className="rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                        <p className="text-xs text-primary-600 font-medium">
                          {isOrganizador ? 'Organizador' : 'Cliente'}
                        </p>
                      </div>
                      
                      <Link href={`/${isOrganizador ? 'organizador' : 'cliente'}/perfil`} 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <User className="h-4 w-4 mr-2" />
                        Meu Perfil
                      </Link>
                      
                      <Link href={`/${isOrganizador ? 'organizador' : 'cliente'}/configuracoes`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurações
                      </Link>
                      
                      <button onClick={handleSignOut}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 font-medium">
                  Entrar
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link href="/excursoes" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Excursões
              </Link>
              
              {session ? (
                <>
                  {isOrganizador && (
                    <Link href="/organizador/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Dashboard
                    </Link>
                  )}
                  
                  {isCliente && (
                    <Link href="/cliente/inscricoes" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Minhas Inscrições
                    </Link>
                  )}
                  
                  <Link href={`/${isOrganizador ? 'organizador' : 'cliente'}/perfil`} 
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Meu Perfil
                  </Link>
                  
                  <button onClick={handleSignOut} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/sobre" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Sobre
                  </Link>
                  <Link href="/contato" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Contato
                  </Link>
                  <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Entrar
                  </Link>
                  <Link href="/auth/register" className="block px-3 py-2 bg-primary-600 text-white rounded-lg">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;