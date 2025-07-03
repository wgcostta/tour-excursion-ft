import api from './api';

class ClienteService {
  async obterPerfil() {
    try {
      const response = await api.get('/cliente/perfil');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  }

  async atualizarPerfil(dados) {
    try {
      const response = await api.put('/cliente/perfil', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async listarInscricoes(page = 0, size = 10) {
    try {
      const response = await api.get(`/cliente/inscricoes?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar inscrições:', error);
      throw error;
    }
  }

  async obterInscricao(id) {
    try {
      const response = await api.get(`/cliente/inscricoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter inscrição:', error);
      throw error;
    }
  }

  async atualizarPushToken(pushToken) {
    try {
      await api.put(`/cliente/notificacoes/push-token?pushToken=${pushToken}`);
    } catch (error) {
      console.error('Erro ao atualizar push token:', error);
      throw error;
    }
  }

  async atualizarConfiguracoes(emailNotifications, smsNotifications) {
    try {
      await api.put('/cliente/notificacoes/configuracoes', null, {
        params: { emailNotifications, smsNotifications }
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }
}

export default new ClienteService();

