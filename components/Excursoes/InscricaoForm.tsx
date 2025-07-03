import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Phone, FileText, Users, CreditCard } from 'lucide-react';
import { Excursao } from '../../types';
import { excursoesService, pagamentosService, formatCurrency } from '../../lib/api';
import toast from 'react-hot-toast';

interface InscricaoFormProps {
  excursao: Excursao;
  onClose: () => void;
  onSuccess: () => void;
}

interface InscricaoData {
  nomeCompleto: string;
  telefone: string;
  documento: string;
  quantidadePessoas: number;
  observacoes?: string;
}

const InscricaoForm: React.FC<InscricaoFormProps> = ({ excursao, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inscricaoId, setInscricaoId] = useState<string>('');
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InscricaoData>({
    defaultValues: {
      quantidadePessoas: 1,
    },
  });

  const quantidadePessoas = watch('quantidadePessoas');
  const valorTotal = quantidadePessoas * excursao.preco;

  const onSubmitInscricao = async (data: InscricaoData) => {
    setIsLoading(true);
    
    try {
      const response = await excursoesService.inscreverse(excursao.id, data);
      setInscricaoId(response.data.id);
      setStep(2);
      toast.success('Inscrição realizada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar inscrição');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagamentoPix = async () => {
    setIsLoading(true);
    
    try {
      const response = await pagamentosService.criarPagamentoPix(inscricaoId);
      const { pixQrCode, pixCopiaeCola } = response.data;
      
      // Aqui você pode abrir um modal com o QR Code do PIX
      // Por simplicidade, vamos apenas mostrar o código copia e cola
      navigator.clipboard.writeText(pixCopiaeCola);
      toast.success('Código PIX copiado! Cole no seu banco para pagar.');
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao gerar pagamento PIX');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagamentoCartao = async () => {
    setIsLoading(true);
    
    try {
      // Aqui você integraria com o Mercado Pago Card Token
      // Por simplicidade, vamos simular
      toast.info('Redirecionando para pagamento com cartão...');
      
      // Simular pagamento com cartão
      setTimeout(() => {
        toast.success('Pagamento processado com sucesso!');
        onSuccess();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? 'Dados da Inscrição' : 'Pagamento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 ? (
            /* Step 1: Inscription Form */
            <form onSubmit={handleSubmit(onSubmitInscricao)} className="space-y-6">
              {/* Excursion Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{excursao.titulo}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Destino: {excursao.destino}</div>
                  <div>Data: {new Date(excursao.dataIda).toLocaleDateString('pt-BR')}</div>
                  <div>Horário: {excursao.horarioSaida}</div>
                  <div>Local de saída: {excursao.localSaida}</div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="form-label">
                    <User className="inline h-4 w-4 mr-1" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    {...register('nomeCompleto', {
                      required: 'Nome completo é obrigatório',
                    })}
                  />
                  {errors.nomeCompleto && (
                    <p className="mt-1 text-sm text-red-600">{errors.nomeCompleto.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="form-input"
                    {...register('telefone', {
                      required: 'Telefone é obrigatório',
                    })}
                  />
                  {errors.telefone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <FileText className="inline h-4 w-4 mr-1" />
                    CPF ou RG
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    className="form-input"
                    {...register('documento', {
                      required: 'Documento é obrigatório',
                    })}
                  />
                  {errors.documento && (
                    <p className="mt-1 text-sm text-red-600">{errors.documento.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">
                    <Users className="inline h-4 w-4 mr-1" />
                    Quantidade de Pessoas
                  </label>
                  <select
                    className="form-input"
                    {...register('quantidadePessoas', {
                      required: 'Quantidade é obrigatória',
                      min: { value: 1, message: 'Mínimo 1 pessoa' },
                      max: { 
                        value: excursao.vagasDisponiveis, 
                        message: `Máximo ${excursao.vagasDisponiveis} pessoas` 
                      },
                    })}
                  >
                    {Array.from({ length: Math.min(excursao.vagasDisponiveis, 10) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'pessoa' : 'pessoas'}
                      </option>
                    ))}
                  </select>
                  {errors.quantidadePessoas && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantidadePessoas.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Observações (Opcional)</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Alguma observação especial..."
                    {...register('observacoes')}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(valorTotal)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {quantidadePessoas} × {formatCurrency(excursao.preco)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment */
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Resumo da Inscrição</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Excursão: {excursao.titulo}</div>
                  <div>Quantidade: {quantidadePessoas} pessoas</div>
                  <div className="font-semibold text-lg text-gray-900">
                    Total: {formatCurrency(valorTotal)}
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Escolha a forma de pagamento
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={handlePagamentoPix}
                    disabled={isLoading}
                    className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">PIX</div>
                        <div className="text-sm text-gray-600">Aprovação instantânea</div>
                      </div>
                    </div>
                    <div className="text-primary-600 group-hover:text-primary-700">
                      →
                    </div>
                  </button>

                  <button
                    onClick={handlePagamentoCartao}
                    disabled={isLoading}
                    className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <CreditCard className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Cartão de Crédito</div>
                        <div className="text-sm text-gray-600">Parcelamento disponível</div>
                      </div>
                    </div>
                    <div className="text-primary-600 group-hover:text-primary-700">
                      →
                    </div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                >
                  Voltar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InscricaoForm;

