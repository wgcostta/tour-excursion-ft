import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import ExcursaoForm from '@/components/Excursoes/ExcursaoForm';
import { excursoesService } from '@/lib/api';
import { Excursao } from '@/types';

const EditarExcursaoPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [excursao, setExcursao] = useState<Excursao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    try {
      setSaving(true);
      await excursoesService.atualizarExcursao(id as string, formData);
      toast.success('Excursão atualizada com sucesso!');
      router.push(`/organizador/excursoes/${id}`);
    } catch (error) {
      toast.error('Erro ao atualizar excursão');
    } finally {
      setSaving(false);
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
    <Layout showSidebar title="Editar Excursão">
      <ExcursaoForm
        excursao={excursao}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isLoading={saving}
      />
    </Layout>
  );
};

export default EditarExcursaoPage;
