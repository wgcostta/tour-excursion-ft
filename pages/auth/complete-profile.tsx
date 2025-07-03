import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Layout from '../../components/Layout';
import { MapPin } from 'lucide-react';
import { authService } from '../../lib/api';
import toast from 'react-hot-toast';

interface CompleteProfileForm {
  userType: 'CLIENTE' | 'ORGANIZADOR';
  telefone: string;
  nomeEmpresa?: string;
  cnpj?: string;
}

const CompleteProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    email: string;
    name: string;
    image?: string;
  } | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CompleteProfileForm>({
    defaultValues: {
      userType: 'CLIENTE',
    },
  });

  const userType = watch('userType');

  useEffect(() => {
    // Get user info from URL params
    const { email, name, image } = router.query;
    
    if (email && name) {
      setUserInfo({
        email: email as string,
        name: name as string,
        image: image as string,
      });
    }
  }, [router.query]);

  const onSubmit = async (data: CompleteProfileForm) => {
    if (!userInfo) {
      toast.error('Informações do usuário não encontradas');
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.completeGoogleProfile({
        email: userInfo.email,
        nome: userInfo.name,
        avatar: userInfo.image,
        tipoUsuario: data.userType,
        telefone: data.telefone,
        nomeEmpresa: data.nomeEmpresa,
        cnpj: data.cnpj,
      });

      toast.success('Perfil completado com sucesso!');
      
      // Fazer login automático
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        toast.error('Erro no login automático');
        router.push('/auth/login');
      } else {
        // Redirecionar baseado no tipo de usuário
        const redirectUrl = data.userType === 'ORGANIZADOR' 
          ? '/organizador/dashboard' 
          : '/cliente/dashboard';
        
        router.push(redirectUrl);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message ||
                          'Erro ao completar perfil';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <Layout title="Carregando...">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Carregando...
            </h2>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Completar Perfil - TourApp">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-primary-600 rounded-lg p-3">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Complete seu perfil
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Olá, {userInfo.name}! Precisamos de mais algumas informações.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Tipo de Usuário */}
              <div>
                <label className="form-label">Tipo de Conta</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    userType === 'CLIENTE' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      value="CLIENTE"
                      {...register('userType', { required: true })}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                        userType === 'CLIENTE' ? 'border-primary-600' : 'border-gray-300'
                      }`}>
                        {userType === 'CLIENTE' && (
                          <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Cliente</span>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    userType === 'ORGANIZADOR' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      value="ORGANIZADOR"
                      {...register('userType', { required: true })}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center ${
                        userType === 'ORGANIZADOR' ? 'border-primary-600' : 'border-gray-300'
                      }`}>
                        {userType === 'ORGANIZADOR' && (
                          <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Organizador</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <input
                  id="telefone"
                  type="tel"
                  className="form-input"
                  placeholder="(11) 99999-9999"
                  {...register('telefone', {
                    required: 'Telefone é obrigatório',
                  })}
                />
                {errors.telefone && (
                  <p className="form-error">{errors.telefone.message}</p>
                )}
              </div>

              {/* Campos específicos do Organizador */}
              {userType === 'ORGANIZADOR' && (
                <>
                  <div>
                    <label htmlFor="nomeEmpresa" className="form-label">
                      Nome da Empresa
                    </label>
                    <input
                      id="nomeEmpresa"
                      type="text"
                      className="form-input"
                      {...register('nomeEmpresa', {
                        required: userType === 'ORGANIZADOR' ? 'Nome da empresa é obrigatório' : false,
                      })}
                    />
                    {errors.nomeEmpresa && (
                      <p className="form-error">{errors.nomeEmpresa.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cnpj" className="form-label">
                      CNPJ (Opcional)
                    </label>
                    <input
                      id="cnpj"
                      type="text"
                      className="form-input"
                      placeholder="00.000.000/0000-00"
                      {...register('cnpj')}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Completando perfil...' : 'Finalizar cadastro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CompleteProfilePage;