import { useMutation } from 'react-query';
import pagamentoService from '../services/pagamentoService';
import { toast } from 'react-hot-toast';

export const usePagamentoPix = () => {
  return useMutation(
    (inscricaoId) => pagamentoService.criarPagamentoPix(inscricaoId),
    {
      onSuccess: (data) => {
        toast.success('Pagamento PIX criado! Use o QR Code para pagar.');
        return data;
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao processar pagamento PIX');
      },
    }
  );
};

export const usePagamentoCartao = () => {
  return useMutation(
    (dadosCartao) => pagamentoService.criarPagamentoCartao(dadosCartao),
    {
      onSuccess: (data) => {
        toast.success('Pagamento processado com sucesso!');
        return data;
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao processar pagamento');
      },
    }
  );
};

