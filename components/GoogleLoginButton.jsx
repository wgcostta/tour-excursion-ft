import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const GoogleLoginButton = () => {
  const { login } = useAuth();
  const router = useRouter();

  const handleSuccess = async (credentialResponse) => {
    try {
      const userData = await login(credentialResponse.credential);
      
      toast.success('Login realizado com sucesso!');
      
      // Redirecionar baseado no tipo de usuário
      if (userData.roles.includes('ROLE_ORGANIZADOR')) {
        router.push('/organizador/dashboard');
      } else if (userData.roles.includes('ROLE_CLIENTE')) {
        router.push('/cliente/perfil');
      } else {
        router.push('/');
      }
    } catch (error) {
      toast.error(error.message || 'Erro no login');
    }
  };

  const handleError = () => {
    toast.error('Erro na autenticação com Google');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      text="signin_with"
      shape="rectangular"
      size="large"
      theme="outline"
      width="100%"
    />
  );
};

export default GoogleLoginButton;

