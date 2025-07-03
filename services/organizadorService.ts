import api from './api';

class OrganizadorService {
  async obterPerfil() {
    try {
      const response = await api.get('/organizador/perfil');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  }

  async atualizarPerfil(dados) {
    try {
      const response = await api.put('/organizador/perfil', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async obterDashboard(dataInicio, dataFim) {
    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);
      
      const response = await api.get(`/organizador/dashboard?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter dashboard:', error);
      throw error;
    }
  }

  async listarInscricoes(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key]);
        }
      });
      
      const response = await api.get(`/organizador/inscricoes?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      throw error;
    }
  }
}

export default new OrganizadorService();

