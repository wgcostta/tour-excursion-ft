import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { MapPin, Users, Shield, Clock, Star, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Destinos Incríveis',
      description: 'Descubra os melhores destinos do Brasil com organizadores experientes.',
    },
    {
      icon: Shield,
      title: 'Pagamento Seguro',
      description: 'Compre com segurança usando PIX ou cartão de crédito.',
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros viajantes e compartilhe experiências.',
    },
    {
      icon: Clock,
      title: 'Suporte 24/7',
      description: 'Nossa equipe está sempre pronta para ajudar você.',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      text: 'Melhor plataforma para encontrar excursões! Já fiz 3 viagens e todas foram perfeitas.',
      rating: 5,
    },
    {
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      text: 'Como organizador, o TourApp revolucionou meu negócio. Vendas aumentaram 300%!',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      location: 'Belo Horizonte, MG',
      text: 'Interface super fácil de usar e pagamento rápido. Recomendo para todos!',
      rating: 5,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Descubra o Brasil com{' '}
              <span className="text-gradient">TourApp</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              A plataforma que conecta viajantes aos melhores organizadores de excursões do país.
              Viaje com segurança, comodidade e preços justos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/excursoes" className="btn-primary text-lg px-8 py-3">
                Ver Excursões
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/auth/register" className="btn-outline text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100">
                Cadastre-se Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o TourApp?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência tanto para viajantes quanto para organizadores de excursões.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-lg mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Excursões Realizadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10k+</div>
              <div className="text-gray-600">Viajantes Satisfeitos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600">Organizadores Parceiros</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-gray-600">
              Depoimentos reais de quem já usou o TourApp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para sua próxima aventura?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de viajantes que já descobriram o Brasil com o TourApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/excursoes" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Explorar Excursões
            </Link>
            <Link href="/auth/register?type=organizador" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
              Tornar-se Organizador
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

