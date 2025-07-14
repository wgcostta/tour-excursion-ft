import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../../../components/Layout';
import ImageUpload from '../../../components/Common/ImageUpload';
import { Calendar, MapPin, Clock, Users, DollarSign, FileText } from 'lucide-react';
import { excursoesService } from '../../../lib/api';
import toast from 'react-hot-toast';

interface ExcursaoForm {
  titulo: string;
  descricao: string;
  localDestino: string;
  dataSaida: string;
  dataRetorno?: string;
  localSaida: string;
  preco: number;
  vagasTotal: number;
  imagens: File[];
}

const NovaExcursaoPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ExcursaoForm>();

  const dataSaida = watch('dataSaida');

  const onSubmit = async (data: ExcursaoForm) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'imagens' && value !== undefined && value !== '') {
          formData.append(key, value.toString());
        }
      });
      
      // Append images
      uploadedImages.forEach((image, index) => {
        formData.append('imagens', image);
      });

      await excursoesService.criarExcursao(formData);
      
      toast.success('Excursão criada com sucesso!');
      router.push('/organizador/excursoes');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar excursão');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout 
      showSidebar={true}
      title="Nova Excursão"
      description="Crie uma nova excursão para seus clientes"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card p-6">
          <h3 className="section-title">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label">
                <FileText className="inline h-4 w-4 mr-1" />
                Título da Excursão
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Excursão para Campos do Jordão"
                {...register('titulo', {
                  required: 'Título é obrigatório',
                  minLength: { value: 5, message: 'Título deve ter pelo menos 5 caracteres' },
                })}
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destino
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Campos do Jordão, SP"
                {...register('localDestino', {
                  required: 'Destino é obrigatório',
                })}
              />
              {errors.localDestino && (
                <p className="mt-1 text-sm text-red-600">{errors.localDestino.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Local de Saída</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Terminal Rodoviário de São Paulo"
                {...register('localSaida', {
                  required: 'Local de saída é obrigatório',
                })}
              />
              {errors.localSaida && (
                <p className="mt-1 text-sm text-red-600">{errors.localSaida.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Descrição</label>
              <textarea
                rows={4}
                className="form-input"
                placeholder="Descreva os detalhes da excursão, o que está incluído, itinerário, etc."
                {...register('descricao', {
                  required: 'Descrição é obrigatória',
                  minLength: { value: 50, message: 'Descrição deve ter pelo menos 50 caracteres' },
                })}
              />
              {errors.descricao && (
                <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="card p-6">
          <h3 className="section-title">Datas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data de Saída
              </label>
              <input
                type="datetime-local"
                className="form-input"
                min={new Date().toISOString().slice(0, 16)}
                {...register('dataSaida', {
                  required: 'Data de saída é obrigatória',
                })}
              />
              {errors.dataSaida && (
                <p className="mt-1 text-sm text-red-600">{errors.dataSaida.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data de Retorno (Opcional)
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

        {/* Pricing and Capacity */}
        <div className="card p-6">
          <h3 className="section-title">Preços e Capacidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Preço por Pessoa
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0,00"
                {...register('preco', {
                  required: 'Preço é obrigatório',
                  min: { value: 0.01, message: 'Preço deve ser maior que zero' },
                })}
              />
              {errors.preco && (
                <p className="mt-1 text-sm text-red-600">{errors.preco.message}</p>
              )}
            </div>


            <div>
              <label className="form-label">
                <Users className="inline h-4 w-4 mr-1" />
                Total de Vagas
              </label>
              <input
                type="number"
                min="1"
                className="form-input"
                placeholder="50"
                {...register('vagasTotal', {
                  required: 'Total de vagas é obrigatório',
                  min: { value: 1, message: 'Deve ter pelo menos 1 vaga' },
                })}
              />
              {errors.vagasTotal && (
                <p className="mt-1 text-sm text-red-600">{errors.vagasTotal.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card p-6">
          <h3 className="section-title">Imagens</h3>
          <ImageUpload
            images={uploadedImages}
            onImagesChange={setUploadedImages}
            maxImages={10}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Criando...' : 'Criar Excursão'}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default NovaExcursaoPage;


