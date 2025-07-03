import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { useCriarExcursao } from '@/hooks/useExcursoes';
import { ExcursaoRequest } from '@/types/excursao';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

const CriarExcursao: React.FC = () => {
  const router = useRouter();
  const criarExcursaoMutation = useCriarExcursao();
  
  const [formData, setFormData] = useState<ExcursaoRequest>({
    titulo: '',
    descricao: '',
    dataSaida: '',
    dataRetorno: '',
    preco: 0,
    vagasTotal: 0,
    localSaida: '',
    localDestino: '',
    observacoes: '',
    aceitaPix: true,
    aceitaCartao: true,
  });
  
  const [imagens, setImagens] = useState<File[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await criarExcursaoMutation.mutateAsync({
        excursaoData: formData,
        imagens
      });
      router.push('/organizador/excursoes');
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImagens(files);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseFloat(value) || 0
          : value
    }));
  };

  return (
    <ProtectedRoute requiredRole="ROLE_ORGANIZADOR">
      <Layout title="Criar Nova Excursão">
        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título da Excursão
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Data de Saída
                </label>
                <input
                  type="datetime-local"
                  name="dataSaida"
                  value={formData.dataSaida}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Data de Retorno
                </label>
                <input
                  type="datetime-local"
                  name="dataRetorno"
                  value={formData.dataRetorno}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Preço (R$)
                </label>
                <input
                  type="number"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Total de Vagas
                </label>
                <input
                  type="number"
                  name="vagasTotal"
                  value={formData.vagasTotal}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Imagens da Excursão
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="aceitaPix"
                  checked={formData.aceitaPix}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Aceita PIX
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="aceitaCartao"
                  checked={formData.aceitaCartao}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Aceita Cartão
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={criarExcursaoMutation.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {criarExcursaoMutation.isLoading ? 'Criando...' : 'Criar Excursão'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CriarExcursao;

