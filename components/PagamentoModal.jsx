import { useState } from 'react';
import { usePagamentoPix, usePagamentoCartao } from '../hooks/usePagamentos';
import { formatCurrency } from '../utils/formatters';
import { validateCardNumber, validateCVV } from '../utils/validation';

const PagamentoModal = ({ isOpen, onClose, inscricao }) => {
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [dadosCartao, setDadosCartao] = useState({
    numeroCartao: '',
    nomeCartao: '',
    mesExpiracao: '',
    anoExpiracao: '',
    cvv: '',
    parcelas: 1,
  });

  const pagamentoPix = usePagamentoPix();
  const pagamentoCartao = usePagamentoCartao();

  const handlePagamentoPix = async () => {
    try {
      const resultado = await pagamentoPix.mutateAsync(inscricao.id);
      // Mostrar QR Code
      setQrCodeData(resultado);
    } catch (error) {
      console.error('Erro no pagamento PIX:', error);
    }
  };

  const handlePagamentoCartao = async () => {
    try {
      // Validações
      if (!validateCardNumber(dadosCartao.numeroCartao)) {
        toast.error('Número do cartão inválido');
        return;
      }
      
      if (!validateCVV(dadosCartao.cvv)) {
        toast.error('CVV inválido');
        return;
      }

      const dadosCompletos = {
        ...dadosCartao,
        inscricaoId: inscricao.id,
      };

      const resultado = await pagamentoCartao.mutateAsync(dadosCompletos);
      // Redirecionar para link de pagamento se necessário
      if (resultado.linkPagamento) {
        window.open(resultado.linkPagamento, '_blank');
      }
      onClose();
    } catch (error) {
      console.error('Erro no pagamento cartão:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pagamento</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-medium">{inscricao.tituloExcursao}</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(inscricao.valorPago)}
          </p>
        </div>

        {/* Seleção do método */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="metodoPagamento"
                value="pix"
                checked={metodoPagamento === 'pix'}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="mr-2"
              />
              PIX
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="metodoPagamento"
                value="cartao"
                checked={metodoPagamento === 'cartao'}
                onChange={(e) => setMetodoPagamento(e.target.value)}
                className="mr-2"
              />
              Cartão de Crédito
            </label>
          </div>
        </div>

        {/* Formulário PIX */}
        {metodoPagamento === 'pix' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clique no botão abaixo para gerar o código PIX e realizar o pagamento.
            </p>
            <button
              onClick={handlePagamentoPix}
              disabled={pagamentoPix.isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {pagamentoPix.isLoading ? 'Gerando PIX...' : 'Gerar PIX'}
            </button>
          </div>
        )}

        {/* Formulário Cartão */}
        {metodoPagamento === 'cartao' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número do Cartão
              </label>
              <input
                type="text"
                value={dadosCartao.numeroCartao}
                onChange={(e) => setDadosCartao(prev => ({
                  ...prev,
                  numeroCartao: e.target.value.replace(/\D/g, '')
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nome no Cartão
              </label>
              <input
                type="text"
                value={dadosCartao.nomeCartao}
                onChange={(e) => setDadosCartao(prev => ({
                  ...prev,
                  nomeCartao: e.target.value.toUpperCase()
                }))}
                placeholder="NOME COMPLETO"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mês
                </label>
                <input
                  type="text"
                  value={dadosCartao.mesExpiracao}
                  onChange={(e) => setDadosCartao(prev => ({
                    ...prev,
                    mesExpiracao: e.target.value.replace(/\D/g, '').slice(0, 2)
                  }))}
                  placeholder="12"
                  maxLength="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Ano
                </label>
                <input
                  type="text"
                  value={dadosCartao.anoExpiracao}
                  onChange={(e) => setDadosCartao(prev => ({
                    ...prev,
                    anoExpiracao: e.target.value.replace(/\D/g, '').slice(0, 4)
                  }))}
                  placeholder="2028"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  value={dadosCartao.cvv}
                  onChange={(e) => setDadosCartao(prev => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                  }))}
                  placeholder="123"
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handlePagamentoCartao}
              disabled={pagamentoCartao.isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {pagamentoCartao.isLoading ? 'Processando...' : 'Pagar com Cartão'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagamentoModal;

