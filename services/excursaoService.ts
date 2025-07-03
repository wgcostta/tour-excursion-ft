import api from './api';
import { Excursao, ExcursaoRequest, ExcursaoFilters } from '@/types/excursao';
import { PaginatedResponse } from '@/types/api';

class ExcursaoService {
  // Métodos para organizadores
  async criarExcursao(excursaoData: ExcursaoRequest, imagens: File[]): Promise<Excursao> {
    try {
      const formData = new FormData();
      
      // Adicionar dados da excursão
      Object.keys(excursaoData).forEach(key => {
        const value = (excursaoData as any)[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Adicionar imagens
      if (imagens && imagens.length > 0) {
        imagens.forEach(imagem => {
          formData.append('imagens', imagem);
        });
      }
      
      const response = await api.post('/organizador/excursoes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar excursão:', error);
      throw new Error(error.response?.data?.error?.message || 'Erro ao criar excursão');
    }
  }

  async listarExcursoes(filtros: ExcursaoFilters = {}): Promise<PaginatedResponse<Excursao>> {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        const value = (filtros as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/organizador/excursoes?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar excursões:', error);
      throw error;
    }
  }

  async obterExcursao(id: string): Promise<Excursao> {
    try {
      const response = await api.get(`/organizador/excursoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter excursão:', error);
      throw error;
    }
  }

  async atualizarExcursao(id: string, excursaoData: ExcursaoRequest, imagens: File[]): Promise<Excursao> {
    try {
      const formData = new FormData();
      
      Object.keys(excursaoData).forEach(key => {
        const value = (excursaoData as any)[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      if (imagens && imagens.length > 0) {
        imagens.forEach(imagem => {
          formData.append('imagens', imagem);
        });
      }
      
      const response = await api.put(`/organizador/excursoes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar excursão:', error);
      throw error;
    }
  }

  async alterarStatus(id: string, status: string): Promise<Excursao> {
    try {
      const response = await api.patch(`/organizador/excursoes/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      throw error;
    }
  }

  async excluirExcursao(id: string): Promise<void> {
    try {
      await api.delete(`/organizador/excursoes/${id}`);
    } catch (error) {
      console.error('Erro ao excluir excursão:', error);
      throw error;
    }
  }

  // Métodos públicos
  async obterExcursaoPublica(id: string): Promise<Excursao> {
    try {
      const response = await api.get(`/public/excursoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter excursão pública:', error);
      throw error;
    }
  }

  async inscreverNaExcursao(excursaoId: string, observacoes?: string): Promise<any> {
    try {
      const response = await api.post(`/public/excursoes/${excursaoId}/inscricoes`, {
        observacoesCliente: observacoes
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao se inscrever:', error);
      throw new Error(error.response?.data?.error?.message || 'Erro ao se inscrever na excursão');
    }
  }
}

export default new ExcursaoService();

