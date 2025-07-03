import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import Sidebar from './Layout/Sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showSidebar?: boolean;
  userType?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'TourApp - Plataforma de Excursões',
  description = 'A melhor plataforma para organizar e descobrir excursões incríveis pelo Brasil.',
  showSidebar = false,
  userType
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          {showSidebar && <Sidebar userType={userType} />}
          
          <main className={`flex-1 ${showSidebar ? 'ml-64' : ''} mt-16`}>
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Layout;