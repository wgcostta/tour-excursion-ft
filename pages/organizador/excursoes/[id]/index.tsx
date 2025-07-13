import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import ImageGallery from '@/components/Excursoes/ImageGallery';
import { excursoesService, formatCurrency, formatDate } from '@/lib/api';
import { Excursao } from '@/types';
import { MapPin, Calendar, Clock, Users, Edit } from 'lucide-react';

const DetalhesExcursaoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [excursao, setExcursao] = useState<Excursao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarExcursao();
    }
  }, [id]);

  const carregarExcursao = async () => {
    try {
      setLoading(true);
      const response = await excursoesService.obterExcursao(id as string);
      const data = response.data?.data || response.data;
      setExcursao(data);
    } catch (error) {
      toast.error('Excursão não encontrada');
      router.push('/organizador/excursoes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout showSidebar title="Carregando...">
        <div className="py-12 text-center">Carregando...</div>
      </Layout>
    );
  }

  if (!excursao) {
    return (
      <Layout showSidebar title="Excursão não encontrada">
        <div className="py-12 text-center">Excursão não encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar title={excursao.titulo}>
      <div className="space-y-6">
        {excursao.imagens && excursao.imagens.length > 0 && (
          <ImageGallery images={excursao.imagens} title={excursao.titulo} />
        )}
        <div className="card p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{excursao.titulo}</h1>
            <button
              onClick={() => router.push(`/organizador/excursoes/${excursao.id}/editar`)}
              className="btn-primary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{excursao.localDestino}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(excursao.dataSaida)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{new Date(excursao.dataSaida).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>{excursao.vagasDisponiveis} / {excursao.vagasTotal} vagas</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="whitespace-pre-line text-gray-700">
              {excursao.descricao}
            </div>
            {excursao.observacoes && (
              <div className="text-gray-700">
                {excursao.observacoes}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 text-xl font-semibold text-primary-600">
            {formatCurrency(excursao.preco)}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalhesExcursaoPage;
