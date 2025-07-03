import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import Layout from '../../components/Layout';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { authService } from '../../lib/api';
import { RegisterOrganizadorForm } from '../../types';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterOrganizadorForm>({
    defaultValues: {
      userType: 'CLIENTE',
    },
  });

  const userType = watch('userType');
  const password = watch('password');

  const onSubmit = async (data: RegisterOrganizadorForm) => {
    setIsLoading(true);
    
    try {
      if (data.userType === 'CLIENTE') {
        await authService.registerCliente({
          nome: data.nome,
          email: data.email,
          password: data.password,
          telefone: data.telefone,
        });
      } else {
        await authService.registerOrganizador({
          nome: data.nome,
          email: data.email,
          password: data.password,
          telefone: data.telefone,
          nomeEmpresa: data.nomeEmpresa!,
          cnpj: data.cnpj,
        });
      }

      toast.success('Conta criada com sucesso!');
      
      // Auto login após cadastro
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        userType: data.userType,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Erro no login automático');
        router.push('/auth/login');
      } else {
        const redirectUrl = data.userType === 'ORGANIZADOR' 
          ? '/organizador/dashboard' 
          : '/cliente/dashboard';
        router.push(redirectUrl);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message ||
                          'Erro ao criar conta';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/auth/complete-profile' });
  };

  return (
    <Layout title="Criar Conta - TourApp">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-primary-600 rounded-lg p-3">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{' '}
              <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                entre na sua conta existente
              </Link>
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

              {/* Nome */}
              <div>
                <label htmlFor="nome" className="form-label">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  className="form-input"
                  placeholder="Digite seu nome completo"
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter no mínimo 2 caracteres',
                    },
                  })}
                />
                {errors.nome && (
                  <p className="form-error">{errors.nome.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="form-input"
                  placeholder="seu@email.com"
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido',
                    },
                  })}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
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
                    pattern: {
                      value: /^(\(?\d{2}\)?\s?)?(\d{4,5})-?(\d{4})$/,
                      message: 'Telefone inválido',
                    },
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
                      placeholder="Digite o nome da sua empresa"
                      {...register('nomeEmpresa', {
                        required: userType === 'ORGANIZADOR' ? 'Nome da empresa é obrigatório' : false,
                        minLength: {
                          value: 2,
                          message: 'Nome da empresa deve ter no mínimo 2 caracteres',
                        },
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
                      {...register('cnpj', {
                        pattern: {
                          value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                          message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX',
                        },
                      })}
                    />
                    {errors.cnpj && (
                      <p className="form-error">{errors.cnpj.message}</p>
                    )}
                  </div>
                </>
              )}

              {/* Senha */}
              <div>
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Digite uma senha segura"
                    {...register('password', {
                      required: 'Senha é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter no mínimo 6 caracteres',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]/,
                        message: 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password.message}</p>
                )}
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input pr-10"
                    placeholder="Digite a senha novamente"
                    {...register('confirmPassword', {
                      required: 'Confirmação de senha é obrigatória',
                      validate: value => value === password || 'Senhas não coincidem',
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Termos */}
              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  {...register('acceptTerms', {
                    required: 'Você deve aceitar os termos de uso',
                  })}
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                  Aceito os{' '}
                  <Link href="/termos" className="text-primary-600 hover:text-primary-500 underline">
                    termos de uso
                  </Link>{' '}
                  e{' '}
                  <Link href="/privacidade" className="text-primary-600 hover:text-primary-500 underline">
                    política de privacidade
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="form-error">{errors.acceptTerms.message}</p>
              )}
            </div>

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Ou continue com</span>
              </div>
            </div>

            {/* Login com Google */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>
            </div>

            {/* Link para login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;