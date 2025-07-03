import api from './api';

class PagamentoService {
  async criarPagamentoPix(inscricaoId) {
    try {
      const response = await api.post('/pagamentos/pix', {
        inscricaoId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      throw new Error(error.response?.data?.error?.message || 'Erro ao processar pagamento PIX');
    }
  }

  async criarPagamentoCartao(dadosCartao) {
    try {
      const response = await api.post('/pagamentos/cartao', dadosCartao);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pagamento cartão:', error);
      throw new Error(error.response?.data?.error?.message || 'Erro ao processar pagamento');
    }
  }
}

export default new PagamentoService();

