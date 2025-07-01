// pages/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Loader } from 'lucide-react';

import TourList from '../components/TourList';
import TourForm from '../components/TourForm';
import SearchFilters from '../components/SearchFilters';
import Pagination from '../components/Pagination';

import { tourApi } from '../lib/api';
import { TourRequest, TourResponse, SearchFilters as SearchFiltersType, TourSummary } from '../types/tour';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState<TourResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchFilters, setSearchFilters] = useState<SearchFiltersType>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const queryClient = useQueryClient();

  // Query para buscar tours
  const { data: toursData, isLoading: isLoadingTours, error: toursError } = useQuery(
    ['tours', currentPage, pageSize, sortBy, sortDir, searchFilters],
    () => {
      if (Object.keys(searchFilters).length > 0) {
        return tourApi.searchTours(searchFilters, currentPage, pageSize, sortBy, sortDir);
      }
      return tourApi.getAllTours(currentPage, pageSize, sortBy, sortDir);
    },
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 segundos
    }
  );

  // Query para destinos populares
  const { data: popularDestinations } = useQuery(
    'popularDestinations',
    tourApi.getPopularDestinations,
    {
      staleTime: 300000, // 5 minutos
    }
  );

  // Mutation para criar tour
  const createTourMutation = useMutation(tourApi.createTour, {
    onSuccess: () => {
      queryClient.invalidateQueries('tours');
      queryClient.invalidateQueries('popularDestinations');
      toast.success('Tour criado com sucesso!');
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar tour');
    },
  });

  // Mutation para atualizar tour
  const updateTourMutation = useMutation(
    ({ id, data }: { id: string; data: TourRequest }) => tourApi.updateTour(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tours');
        queryClient.invalidateQueries('popularDestinations');
        toast.success('Tour atualizado com sucesso!');
        setShowForm(false);
        setEditingTour(null);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao atualizar tour');
      },
    }
  );

  // Mutation para deletar tour
  const deleteTourMutation = useMutation(tourApi.deleteTour, {
    onSuccess: () => {
      queryClient.invalidateQueries('tours');
      queryClient.invalidateQueries('popularDestinations');
      toast.success('Tour excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao excluir tour');
    },
  });

  const handleCreateTour = () => {
    setEditingTour(null);
    setShowForm(true);
  };

  const handleEditTour = async (id: string) => {
    try {
      const tour = await tourApi.getTourById(id);
      setEditingTour(tour);
      setShowForm(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao buscar tour');
    }
  };

  const handleViewTour = async (id: string) => {
    try {
      const tour = await tourApi.getTourById(id);
      alert(`Tour: ${tour.name}\nDescrição: ${tour.description}\nDestino: ${tour.destination}\nPreço: R$ ${tour.price}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao buscar tour');
    }
  };

  const handleDeleteTour = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este tour?')) {
      deleteTourMutation.mutate(id);
    }
  };

  const handleFormSubmit = async (data: TourRequest) => {
    if (editingTour) {
      updateTourMutation.mutate({ id: editingTour.id, data });
    } else {
      createTourMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTour(null);
  };

  const handleSearch = (filters: SearchFiltersType) => {
    setSearchFilters(filters);
    setCurrentPage(0);
  };

  const handleClearSearch = () => {
    setSearchFilters({});
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const tours = toursData?.content || [];
  const totalPages = toursData?.totalPages || 0;
  const totalElements = toursData?.totalElements || 0;

  if (toursError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erro ao carregar dados</h1>
          <p className="text-gray-600">Verifique se a API está funcionando corretamente</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tour App - Gerenciamento de Tours</title>
        <meta name="description" content="Sistema de gerenciamento de tours turísticos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Tour App</h1>
              {!showForm && (
                <button
                  onClick={handleCreateTour}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Novo Tour</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showForm ? (
            <TourForm
              tour={editingTour || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={createTourMutation.isLoading || updateTourMutation.isLoading}
            />
          ) : (
            <>
              {/* Filtros de Busca */}
              <SearchFilters
                onSearch={handleSearch}
                onClear={handleClearSearch}
                popularDestinations={popularDestinations}
              />

              {/* Lista de Tours */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Tours ({totalElements})
                    </h2>
                    {isLoadingTours && (
                      <Loader className="animate-spin text-blue-600" size={20} />
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <TourList
                    tours={tours}
                    onEdit={handleEditTour}
                    onDelete={handleDeleteTour}
                    onView={handleViewTour}
                    isLoading={isLoadingTours}
                  />
                </div>

                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalElements={totalElements}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
