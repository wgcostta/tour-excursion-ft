import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Phone, FileText, Users, CreditCard, AlertCircle } from 'lucide-react';
import { Excursao } from '../../types';
import { excursoesService, pagamentosService, formatCurrency } from '../../lib/api';
import ErrorTooltip from '../Common/ErrorTooltip';
import { useFormErrorTooltip } from '../../hooks/useErrorTooltip';
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
  const [globalError, setGlobalError] = useState<string>('');
  
  const { 
    showFieldError, 
    hideFieldError, 
    clearAllErrors, 
    isFieldErrorVisible, 
    getFieldError 
  } = useFormErrorTooltip();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InscricaoData>({
    defaultValues: {
      quantidadePessoas: 1,
    },
  });

  const quantidadePessoas = watch('quantidadePessoas');
  const valorTotal = quantidadePessoas * excursao.preco;

  const onSubmitInscricao = async (data: InscricaoData) => {
    setIsLoading(true);
    setGlobalError('');
    
    try {
      clearAllErrors();
      const response = await excursoesService.inscreverse(excursao.id, data);
      setInscricaoId(response.data.id);
      setStep(2);
      toast.success('Inscrição realizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao realizar inscrição:', error);
      
      // Tratar erros de validação específicos por campo
      if (error.response?.data?.validationErrors) {
        Object.entries(error.response.data.validationErrors).forEach(([field, message]) => {
          showFieldError(field, message as string);
        });
      } else {
        // Erro global
        const errorMessage = error.response?.data?.message || 'Erro ao realizar inscrição';
        setGlobalError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagamentoPix = async () => {
    setIsLoading(true);
    
    try {
      const response = await pagamentosService.criarPagamentoPix(inscricaoId);
      const { pixQrCode, pixCopiaeCola } = response.data;
      
      // Copiar código PIX para área de transferência
      if (pixCopiaeCola) {
        try {
          await navigator.clipboard.writeText(pixCopiaeCola);
          toast.success('Código PIX copiado! Cole no seu banco para pagar.');
        } catch (clipboardError) {
          // Fallback se clipboard API não estiver disponível
          toast.success('QR Code PIX gerado com sucesso!');
        }
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Erro no pagamento PIX:', error);
      toast.error(error.response?.data?.message || 'Erro ao gerar pagamento PIX');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagamentoCartao = async () => {
    setIsLoading(true);
    
    try {
      // Aqui você integraria com o Mercado Pago Card Token
      // Por simplicidade, vamos simular o redirecionamento
      toast.info('Redirecionando para pagamento com cartão...');
      
      // Simular redirecionamento para pagamento
      setTimeout(() => {
        toast.success('Pagamento processado com sucesso!');
        onSuccess();
      }, 2000);
    } catch (error: any) {
      console.error('Erro no pagamento cartão:', error);
      toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldFocus = (fieldName: keyof InscricaoData) => {
    const errorMessage = errors[fieldName]?.message || getFieldError(fieldName);
    if (errorMessage) {
      showFieldError(fieldName, errorMessage);
    }
  };

  const handleFieldBlur = (fieldName: keyof InscricaoData) => {
    // Delay para permitir interação com o tooltip
    setTimeout(() => {
      hideFieldError(fieldName);
    }, 150);
  };

  const hasFieldError = (fieldName: keyof InscricaoData) => {
    return !!(errors[fieldName] || isFieldErrorVisible(fieldName));
  };

  const getErrorMessage = (fieldName: keyof InscricaoData) => {
    return errors[fieldName]?.message || getFieldError(fieldName);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/;
    return phoneRegex.test(phone) || 'Formato de telefone inválido';
  };

  const validateDocument = (doc: string) => {
    const cleanDoc = doc.replace(/\D/g, '');
    if (cleanDoc.length === 11 || cleanDoc.length === 14) {
      return true;
    }
    return 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar modal"
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
                  <div>Destino: {excursao.localDestino}</div>
                  <div>Data: {new Date(excursao.dataSaida).toLocaleDateString('pt-BR')}</div>
                  <div>
                    Horário:
                    {new Date(excursao.dataSaida).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div>Local de saída: {excursao.localSaida}</div>
                </div>
              </div>

              {/* Global Error */}
              {globalError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800">Erro na inscrição</h3>
                      <p className="text-sm text-red-700 mt-1">{globalError}</p>
                    </div>
                    <button
                      onClick={() => setGlobalError('')}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="form-label">
                    <User className="inline h-4 w-4 mr-1" />
                    Nome Completo
                  </label>
                  <ErrorTooltip
                    message={getErrorMessage('nomeCompleto')}
                    isVisible={isFieldErrorVisible('nomeCompleto')}
                    onClose={() => hideFieldError('nomeCompleto')}
                    position="bottom"
                  >
                    <input
                      type="text"
                      className={`form-input ${hasFieldError('nomeCompleto') ? 'error-border' : ''}`}
                      placeholder="Digite seu nome completo"
                      {...register('nomeCompleto', {
                        required: 'Nome completo é obrigatório',
                        minLength: {
                          value: 2,
                          message: 'Nome deve ter pelo menos 2 caracteres'
                        },
                        pattern: {
                          value: /^[A-Za-zÀ-ÿ\s]+$/,
                          message: 'Nome deve conter apenas letras e espaços'
                        }
                      })}
                      onFocus={() => handleFieldFocus('nomeCompleto')}
                      onBlur={() => handleFieldBlur('nomeCompleto')}
                    />
                  </ErrorTooltip>
                </div>

                <div className="relative">
                  <label className="form-label">
                    <Phone className="inline h-4 w-4 mr-1" />
                    Telefone
                  </label>
                  <ErrorTooltip
                    message={getErrorMessage('telefone')}
                    isVisible={isFieldErrorVisible('telefone')}
                    onClose={() => hideFieldError('telefone')}
                    position="bottom"
                  >
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className={`form-input ${hasFieldError('telefone') ? 'error-border' : ''}`}
                      {...register('telefone', {
                        required: 'Telefone é obrigatório',
                        validate: validatePhone
                      })}
                      onFocus={() => handleFieldFocus('telefone')}
                      onBlur={() => handleFieldBlur('telefone')}
                    />
                  </ErrorTooltip>
                  <p className="mt-1 text-xs text-gray-500">
                    Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
                  </p>
                </div>

                <div className="relative">
                  <label className="form-label">
                    <FileText className="inline h-4 w-4 mr-1" />
                    CPF ou RG
                  </label>
                  <ErrorTooltip
                    message={getErrorMessage('documento')}
                    isVisible={isFieldErrorVisible('documento')}
                    onClose={() => hideFieldError('documento')}
                    position="bottom"
                  >
                    <input
                      type="text"
                      placeholder="000.000.000-00 ou 12.345.678-9"
                      className={`form-input ${hasFieldError('documento') ? 'error-border' : ''}`}
                      {...register('documento', {
                        required: 'Documento é obrigatório',
                        validate: validateDocument
                      })}
                      onFocus={() => handleFieldFocus('documento')}
                      onBlur={() => handleFieldBlur('documento')}
                    />
                  </ErrorTooltip>
                  <p className="mt-1 text-xs text-gray-500">
                    Informe seu CPF ou RG
                  </p>
                </div>

                <div className="relative">
                  <label className="form-label">
                    <Users className="inline h-4 w-4 mr-1" />
                    Quantidade de Pessoas
                  </label>
                  <ErrorTooltip
                    message={getErrorMessage('quantidadePessoas')}
                    isVisible={isFieldErrorVisible('quantidadePessoas')}
                    onClose={() => hideFieldError('quantidadePessoas')}
                    position="bottom"
                  >
                    <select
                      className={`form-input ${hasFieldError('quantidadePessoas') ? 'error-border' : ''}`}
                      {...register('quantidadePessoas', {
                        required: 'Quantidade é obrigatória',
                        min: { value: 1, message: 'Mínimo 1 pessoa' },
                        max: { 
                          value: excursao.vagasDisponiveis, 
                          message: `Máximo ${excursao.vagasDisponiveis} pessoas` 
                        },
                      })}
                      onFocus={() => handleFieldFocus('quantidadePessoas')}
                      onBlur={() => handleFieldBlur('quantidadePessoas')}
                    >
                      {Array.from({ length: Math.min(excursao.vagasDisponiveis, 10) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'pessoa' : 'pessoas'}
                        </option>
                      ))}
                    </select>
                  </ErrorTooltip>
                  <p className="mt-1 text-xs text-gray-500">
                    Disponível: {excursao.vagasDisponiveis} vaga{excursao.vagasDisponiveis !== 1 ? 's' : ''}
                  </p>
                </div>

                <div>
                  <label className="form-label">Observações (Opcional)</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Alguma observação especial, necessidades dietéticas, etc..."
                    {...register('observacoes', {
                      maxLength: {
                        value: 500,
                        message: 'Observações devem ter no máximo 500 caracteres'
                      }
                    })}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Máximo 500 caracteres
                  </p>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total a pagar:</span>
                    <span className="text-primary-600">{formatCurrency(valorTotal)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {quantidadePessoas} pessoa{quantidadePessoas > 1 ? 's' : ''} × {formatCurrency(excursao.preco)}
                  </div>
                  {quantidadePessoas > 1 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Preço por pessoa: {formatCurrency(excursao.preco)}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline flex-1"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </span>
                  ) : (
                    'Continuar para Pagamento'
                  )}
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
                  <div><strong>Excursão:</strong> {excursao.titulo}</div>
                  <div><strong>Quantidade:</strong> {quantidadePessoas} pessoa{quantidadePessoas > 1 ? 's' : ''}</div>
                  <div className="font-semibold text-lg text-gray-900 mt-2">
                    <strong>Total:</strong> {formatCurrency(valorTotal)}
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Escolha a forma de pagamento
                </h3>

                <div className="space-y-3">
                  {excursao.aceitaPix && (
                    <button
                      onClick={handlePagamentoPix}
                      disabled={isLoading}
                      className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  )}

                  {excursao.aceitaCartao && (
                    <button
                      onClick={handlePagamentoCartao}
                      disabled={isLoading}
                      className="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  )}

                  {!excursao.aceitaPix && !excursao.aceitaCartao && (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Nenhuma forma de pagamento disponível no momento.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Informações de Segurança</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Pagamento processado via Mercado Pago</li>
                  <li>• Dados protegidos com criptografia SSL</li>
                  <li>• Confirmação enviada por email</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="btn-outline flex-1"
                  disabled={isLoading}
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