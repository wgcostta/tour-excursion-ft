import React, { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import Layout from '../../components/Layout';
import { Eye, EyeOff, MapPin } from 'lucide-react';
import { LoginForm } from '../../types';
import ErrorTooltip from '../../components/Common/ErrorTooltip';
import { useFormErrorTooltip } from '../../hooks/useErrorTooltip';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    showFieldError, 
    hideFieldError, 
    clearAllErrors, 
    isFieldErrorVisible, 
    getFieldError 
  } = useFormErrorTooltip();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      userType: 'CLIENTE',
    },
  });

  const userType = watch('userType');

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    
    try {
      clearAllErrors();
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        userType: data.userType,
        redirect: false,
      });

      if (result?.error) {
        // Simular erros específicos por campo para demonstração
        if (result.error.includes('email')) {
          showFieldError('email', 'E-mail não encontrado');
        } else if (result.error.includes('password')) {
          showFieldError('password', 'Senha incorreta');
        } else {
          toast.error('Credenciais inválidas');
        }
      } else {
        // Obter a sessão atualizada para verificar o tipo de usuário
        const session = await getSession();
        
        toast.success('Login realizado com sucesso!');
        
        // Redirecionar baseado no tipo de usuário
        const redirectUrl = session?.userType === 'ORGANIZADOR' 
          ? '/organizador/dashboard' 
          : '/cliente/dashboard';
        
        router.push(redirectUrl);
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/auth/complete-profile' });
  };

  const handleFieldFocus = (fieldName: keyof LoginForm) => {
    const errorMessage = errors[fieldName]?.message || getFieldError(fieldName);
    if (errorMessage) {
      showFieldError(fieldName, errorMessage);
    }
  };

  const handleFieldBlur = (fieldName: keyof LoginForm) => {
    setTimeout(() => {
      hideFieldError(fieldName);
    }, 150);
  };

  const hasFieldError = (fieldName: keyof LoginForm) => {
    return !!(errors[fieldName] || isFieldErrorVisible(fieldName));
  };

  const getErrorMessage = (fieldName: keyof LoginForm) => {
    return errors[fieldName]?.message || getFieldError(fieldName);
  };

  return (
    <Layout title="Login - TourApp">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="bg-primary-600 rounded-lg p-3">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Entre na sua conta
            </h2>
            
            <div className="flex justify-center">
 
            {/* Login com Google */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            </div>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{' '}
              <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
                crie uma nova conta
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;