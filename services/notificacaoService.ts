import api from './api';

class NotificacaoService {
  async criarNotificacao(dadosNotificacao) {
    try {
      const response = await api.post('/organizador/notificacoes', dadosNotificacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  async enviarNotificacao(id) {
    try {
      await api.post(`/organizador/notificacoes/${id}/enviar`);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  async listarNotificacoes(page = 0, size = 10) {
    try {
      const response = await api.get(`/organizador/notificacoes?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      throw error;
    }
  }

  async listarClientesPorExcursao(excursaoId) {
    try {
      const response = await api.get(`/organizador/notificacoes/clientes/${excursaoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }
}

export default new NotificacaoService();

