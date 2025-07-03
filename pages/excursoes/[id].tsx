import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import ImageGallery from '../../components/Excursoes/ImageGallery';
import InscricaoForm from '../../components/Excursoes/InscricaoForm';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  Shield,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import { excursoesService, formatCurrency, formatDate, formatDateTime } from '../../lib/api';
import { Excursao } from '../../types';
import toast from 'react-hot-toast';

const ExcursaoDetailsPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = router.query;
  
  const [excursao, setExcursao] = useState<Excursao | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInscricaoForm, setShowInscricaoForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadExcursao();
    }
  }, [id]);

  const loadExcursao = async () => {
    try {
      setLoading(true);
      const response = await excursoesService.getPublicExcursao(id as string);
      setExcursao(response.data);
    } catch (error) {
      toast.error('Excursão não encontrada');
      router.push('/excursoes');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: excursao?.titulo,
          text: excursao?.descricao,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!excursao) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Excursão não encontrada
          </h1>
          <button onClick={() => router.push('/excursoes')} className="btn-primary">
            Voltar para Excursões
          </button>
        </div>
      </Layout>
    );
  }

  const isDisponivel = excursao.status === 'ATIVA' && excursao.vagasDisponiveis > 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Image Gallery */}
        <ImageGallery images={excursao.imagens} title={excursao.titulo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {excursao.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{excursao.destino}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{excursao.vagasDisponiveis} vagas disponíveis de {excursao.vagasTotal}</span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="btn-outline flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </button>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  excursao.status === 'ATIVA'
                    ? 'bg-green-100 text-green-800'
                    : excursao.status === 'INATIVA'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {excursao.status === 'ATIVA' ? 'Disponível' :
                   excursao.status === 'INATIVA' ? 'Indisponível' : 'Cancelada'}
                </span>
              </div>

              {/* Price */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary-600">
                      {formatCurrency(excursao.preco)}
                    </span>
                    {excursao.precoMenor && (
                      <div className="text-sm text-gray-600">
                        Criança: {formatCurrency(excursao.precoMenor)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detalhes da Excursão
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Data de Ida</div>
                    <div className="font-medium">{formatDate(excursao.dataIda)}</div>
                  </div>
                </div>

                {excursao.dataVolta && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Data de Volta</div>
                      <div className="font-medium">{formatDate(excursao.dataVolta)}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Horário de Saída</div>
                    <div className="font-medium">{excursao.horarioSaida}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Local de Saída</div>
                    <div className="font-medium">{excursao.localSaida}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Descrição
                </h3>
                <div className="prose max-w-none text-gray-700">
                  {excursao.descricao.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Organizador Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre o Organizador
              </h2>
              
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {excursao.organizador.nomeEmpresa.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {excursao.organizador.nomeEmpresa}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Responsável: {excursao.organizador.nome}
                  </p>
                  
                  {excursao.organizador.descricao && (
                    <p className="text-gray-700 mb-3">
                      {excursao.organizador.descricao}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {excursao.organizador.telefone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{excursao.organizador.telefone}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{excursao.organizador.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {formatCurrency(excursao.preco)}
                  </div>
                  {excursao.precoMenor && (
                    <div className="text-sm text-gray-600">
                      Criança: {formatCurrency(excursao.precoMenor)}
                    </div>
                  )}
                </div>

                {isDisponivel ? (
                  <>
                    {session ? (
                      <button
                        onClick={() => setShowInscricaoForm(true)}
                        className="btn-primary w-full mb-4"
                      >
                        Inscrever-se Agora
                      </button>
                    ) : (
                      <div className="space-y-3 mb-4">
                        <button
                          onClick={() => router.push('/auth/login')}
                          className="btn-primary w-full"
                        >
                          Entrar para se Inscrever
                        </button>
                        <button
                          onClick={() => router.push('/auth/register')}
                          className="btn-outline w-full"
                        >
                          Criar Conta
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button disabled className="btn-secondary w-full mb-4 opacity-50 cursor-not-allowed">
                    {excursao.status === 'CANCELADA' ? 'Excursão Cancelada' : 'Esgotado'}
                  </button>
                )}

                {/* Security Info */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2 text-green-500" />
                    <span>Cancelamento gratuito até 24h</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Organizador verificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inscription Modal */}
      {showInscricaoForm && (
        <InscricaoForm
          excursao={excursao}
          onClose={() => setShowInscricaoForm(false)}
          onSuccess={() => {
            setShowInscricaoForm(false);
            loadExcursao(); // Reload to update available spots
          }}
        />
      )}
    </Layout>
  );
};

export default ExcursaoDetailsPage;

