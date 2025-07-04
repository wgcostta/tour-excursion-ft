import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, MapPin, Clock, Users, DollarSign, FileText } from 'lucide-react';
import { ExcursaoForm as ExcursaoFormType, Excursao } from '../../types';
import ImageUpload from '../Common/ImageUpload';
import ErrorTooltip from '../Common/ErrorTooltip';
import { useFormErrorTooltip } from '../../hooks/useErrorTooltip';
import toast from 'react-hot-toast';

interface ExcursaoFormProps {
  excursao?: Excursao;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ExcursaoForm: React.FC<ExcursaoFormProps> = ({ 
  excursao, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const { 
    showFieldError, 
    hideFieldError, 
    clearAllErrors, 
    isFieldErrorVisible, 
    getFieldError 
  } = useFormErrorTooltip();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExcursaoFormType>({
    defaultValues: excursao ? {
      titulo: excursao.titulo,
      descricao: excursao.descricao,
      dataSaida: excursao.dataSaida.split('T')[0] + 'T' + excursao.dataSaida.split('T')[1]?.substring(0, 5) || '09:00',
      dataRetorno: excursao.dataRetorno ? excursao.dataRetorno.split('T')[0] + 'T' + excursao.dataRetorno.split('T')[1]?.substring(0, 5) : undefined,
      preco: excursao.preco,
      vagasTotal: excursao.vagasTotal,
      localSaida: excursao.localSaida,
      localDestino: excursao.localDestino,
      observacoes: excursao.observacoes,
      aceitaPix: excursao.aceitaPix,
      aceitaCartao: excursao.aceitaCartao,
      imagens: [],
    } : {
      aceitaPix: true,
      aceitaCartao: true,
      imagens: [],
    },
  });

  const dataSaida = watch('dataSaida');

  const handleFormSubmit = async (data: ExcursaoFormType) => {
    try {
      clearAllErrors();
      
      const formData = new FormData();
      
      // Append form fields
      formData.append('titulo', data.titulo);
      formData.append('descricao', data.descricao);
      formData.append('dataSaida', new Date(data.dataSaida).toISOString());
      
      if (data.dataRetorno) {
        formData.append('dataRetorno', new Date(data.dataRetorno).toISOString());
      }
      
      formData.append('preco', data.preco.toString());
      formData.append('vagasTotal', data.vagasTotal.toString());
      formData.append('localSaida', data.localSaida);
      formData.append('localDestino', data.localDestino);
      
      if (data.observacoes) {
        formData.append('observacoes', data.observacoes);
      }
      
      formData.append('aceitaPix', data.aceitaPix.toString());
      formData.append('aceitaCartao', data.aceitaCartao.toString());
      
      // Append images
      uploadedImages.forEach((image) => {
        formData.append('imagens', image);
      });

      await onSubmit(formData);
    } catch (error: any) {
      console.error('Erro ao submeter formulário:', error);
      
      // Tratar erros de validação da API
      if (error.response?.data?.validationErrors) {
        Object.entries(error.response.data.validationErrors).forEach(([field, message]) => {
          showFieldError(field, message as string);
        });
      } else {
        toast.error('Erro ao salvar excursão');
      }
    }
  };

  const handleFieldFocus = (fieldName: keyof ExcursaoFormType) => {
    const errorMessage = errors[fieldName]?.message || getFieldError(fieldName);
    if (errorMessage) {
      showFieldError(fieldName, errorMessage);
    }
  };

  const handleFieldBlur = (fieldName: keyof ExcursaoFormType) => {
    setTimeout(() => {
      hideFieldError(fieldName);
    }, 150);
  };

  const hasFieldError = (fieldName: keyof ExcursaoFormType) => {
    return !!(errors[fieldName] || isFieldErrorVisible(fieldName));
  };

  const getErrorMessage = (fieldName: keyof ExcursaoFormType) => {
    return errors[fieldName]?.message || getFieldError(fieldName);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Informações Básicas */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <FileText className="inline h-5 w-5 mr-2" />
          Informações Básicas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 relative">
            <label className="form-label">
              Título da Excursão
            </label>
            <ErrorTooltip
              message={getErrorMessage('titulo')}
              isVisible={isFieldErrorVisible('titulo')}
              onClose={() => hideFieldError('titulo')}
              position="bottom"
            >
              <input
                type="text"
                className={`form-input ${hasFieldError('titulo') ? 'error-border' : ''}`}
                placeholder="Ex: Excursão para Campos do Jordão"
                {...register('titulo', {
                  required: 'Título é obrigatório',
                  minLength: { value: 5, message: 'Título deve ter pelo menos 5 caracteres' },
                })}
                onFocus={() => handleFieldFocus('titulo')}
                onBlur={() => handleFieldBlur('titulo')}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="form-label">
              <MapPin className="inline h-4 w-4 mr-1" />
              Local de Saída
            </label>
            <ErrorTooltip
              message={getErrorMessage('localSaida')}
              isVisible={isFieldErrorVisible('localSaida')}
              onClose={() => hideFieldError('localSaida')}
              position="bottom"
            >
              <input
                type="text"
                className={`form-input ${hasFieldError('localSaida') ? 'error-border' : ''}`}
                placeholder="Ex: Terminal Rodoviário de São Paulo"
                {...register('localSaida', {
                  required: 'Local de saída é obrigatório',
                })}
                onFocus={() => handleFieldFocus('localSaida')}
                onBlur={() => handleFieldBlur('localSaida')}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="form-label">
              <MapPin className="inline h-4 w-4 mr-1" />
              Destino
            </label>
            <ErrorTooltip
              message={getErrorMessage('localDestino')}
              isVisible={isFieldErrorVisible('localDestino')}
              onClose={() => hideFieldError('localDestino')}
              position="bottom"
            >
              <input
                type="text"
                className={`form-input ${hasFieldError('localDestino') ? 'error-border' : ''}`}
                placeholder="Ex: Campos do Jordão, SP"
                {...register('localDestino', {
                  required: 'Destino é obrigatório',
                })}
                onFocus={() => handleFieldFocus('localDestino')}
                onBlur={() => handleFieldBlur('localDestino')}
              />
            </ErrorTooltip>
          </div>

          <div className="md:col-span-2 relative">
            <label className="form-label">Descrição</label>
            <ErrorTooltip
              message={getErrorMessage('descricao')}
              isVisible={isFieldErrorVisible('descricao')}
              onClose={() => hideFieldError('descricao')}
              position="top"
            >
              <textarea
                rows={4}
                className={`form-input ${hasFieldError('descricao') ? 'error-border' : ''}`}
                placeholder="Descreva os detalhes da excursão, o que está incluído, itinerário, etc."
                {...register('descricao', {
                  required: 'Descrição é obrigatória',
                  minLength: { value: 50, message: 'Descrição deve ter pelo menos 50 caracteres' },
                })}
                onFocus={() => handleFieldFocus('descricao')}
                onBlur={() => handleFieldBlur('descricao')}
              />
            </ErrorTooltip>
          </div>
        </div>
      </div>

      {/* Datas e Horários */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Calendar className="inline h-5 w-5 mr-2" />
          Datas e Horários
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="form-label">
              Data e Hora de Saída
            </label>
            <ErrorTooltip
              message={getErrorMessage('dataSaida')}
              isVisible={isFieldErrorVisible('dataSaida')}
              onClose={() => hideFieldError('dataSaida')}
              position="bottom"
            >
              <input
                type="datetime-local"
                className={`form-input ${hasFieldError('dataSaida') ? 'error-border' : ''}`}
                min={new Date().toISOString().slice(0, 16)}
                {...register('dataSaida', {
                  required: 'Data de saída é obrigatória',
                })}
                onFocus={() => handleFieldFocus('dataSaida')}
                onBlur={() => handleFieldBlur('dataSaida')}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="form-label">
              Data e Hora de Retorno (Opcional)
            </label>
            <input
              type="datetime-local"
              className="form-input"
              min={dataSaida}
              {...register('dataRetorno')}
            />
          </div>
        </div>
      </div>

      {/* Preços e Capacidade */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <DollarSign className="inline h-5 w-5 mr-2" />
          Preços e Capacidade
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="form-label">
              Preço por Pessoa (R$)
            </label>
            <ErrorTooltip
              message={getErrorMessage('preco')}
              isVisible={isFieldErrorVisible('preco')}
              onClose={() => hideFieldError('preco')}
              position="bottom"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-input ${hasFieldError('preco') ? 'error-border' : ''}`}
                placeholder="0,00"
                {...register('preco', {
                  required: 'Preço é obrigatório',
                  min: { value: 0.01, message: 'Preço deve ser maior que zero' },
                })}
                onFocus={() => handleFieldFocus('preco')}
                onBlur={() => handleFieldBlur('preco')}
              />
            </ErrorTooltip>
          </div>

          <div className="relative">
            <label className="form-label">
              <Users className="inline h-4 w-4 mr-1" />
              Total de Vagas
            </label>
            <ErrorTooltip
              message={getErrorMessage('vagasTotal')}
              isVisible={isFieldErrorVisible('vagasTotal')}
              onClose={() => hideFieldError('vagasTotal')}
              position="bottom"
            >
              <input
                type="number"
                min="1"
                className={`form-input ${hasFieldError('vagasTotal') ? 'error-border' : ''}`}
                placeholder="50"
                {...register('vagasTotal', {
                  required: 'Total de vagas é obrigatório',
                  min: { value: 1, message: 'Deve ter pelo menos 1 vaga' },
                })}
                onFocus={() => handleFieldFocus('vagasTotal')}
                onBlur={() => handleFieldBlur('vagasTotal')}
              />
            </ErrorTooltip>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div className="mt-6">
          <label className="form-label">Formas de Pagamento Aceitas</label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('aceitaPix')}
              />
              <span className="ml-2 text-sm text-gray-900">PIX</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('aceitaCartao')}
              />
              <span className="ml-2 text-sm text-gray-900">Cartão de Crédito</span>
            </label>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações Adicionais</h3>
        <textarea
          rows={3}
          className="form-input"
          placeholder="Informações adicionais importantes sobre a excursão..."
          {...register('observacoes')}
        />
      </div>

      {/* Upload de Imagens */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagens da Excursão</h3>
        <ImageUpload
          images={uploadedImages}
          onImagesChange={setUploadedImages}
          maxImages={10}
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Salvando...' : excursao ? 'Atualizar' : 'Criar Excursão'}
        </button>
      </div>
    </form>
  );
};

export default ExcursaoForm;