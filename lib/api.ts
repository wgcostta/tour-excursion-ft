// lib/api.ts
import axios from 'axios';
import { TourRequest, TourResponse, TourSummary, TourStatus, PageResponse, SearchFilters } from '../types/tour';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tourApi = {
  // Criar tour
  createTour: async (tour: TourRequest): Promise<TourResponse> => {
    const response = await api.post('/tours', tour);
    return response.data;
  },

  // Buscar tour por ID
  getTourById: async (id: string): Promise<TourResponse> => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  // Listar todos os tours com paginação
  getAllTours: async (
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<PageResponse<TourSummary>> => {
    const response = await api.get('/tours', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Buscar tours com filtros
  searchTours: async (
    filters: SearchFilters,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<PageResponse<TourSummary>> => {
    const params = {
      ...filters,
      page,
      size,
      sortBy,
      sortDir
    };
    
    const response = await api.get('/tours/search', { params });
    return response.data;
  },

  // Atualizar tour
  updateTour: async (id: string, tour: TourRequest): Promise<TourResponse> => {
    const response = await api.put(`/tours/${id}`, tour);
    return response.data;
  },

  // Deletar tour
  deleteTour: async (id: string): Promise<void> => {
    await api.delete(`/tours/${id}`);
  },

  // Buscar tours por status
  getToursByStatus: async (
    status: TourStatus,
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  ): Promise<PageResponse<TourSummary>> => {
    const response = await api.get(`/tours/status/${status}`, {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Buscar destinos populares
  getPopularDestinations: async (): Promise<string[]> => {
    const response = await api.get('/tours/destinations/popular');
    return response.data;
  }
};

export default api;