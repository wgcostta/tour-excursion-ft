// ARQUIVO: lib/api.ts - ATUALIZADO PARA USAR O INTERCEPTOR
import axios, { AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função utilitária para obter token de autenticação
const getAuthToken = async (): Promise<string | null> => {
  // Verificar se estamos no browser
  if (typeof window === 'undefined') return null;

  // Primeiro, tentar localStorage
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken.startsWith('Bearer ') ? localToken : `Bearer ${localToken}`;
  }

  // Depois, tentar session do NextAuth
  try {
    const session = await getSession();
    if (session?.accessToken) {
      return session.accessToken.startsWith('Bearer ') 
        ? session.accessToken 
        : `Bearer ${session.accessToken}`;
    }
  } catch (error) {
    console.warn('Erro ao obter sessão:', error);
  }

  return null;
};

// Configurar interceptor de request para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configurar interceptor de response para tratar erros 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Limpar token inválido
      localStorage.removeItem('token');
      
      // Se não for uma rota de autenticação, redirecionar
      if (!error.config?.url?.includes('/auth/')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// NOTA: Os interceptors são configurados automaticamente pelo ErrorProvider
// Mas mantemos essa configuração básica para garantir funcionalidade

// Tipos existentes permanecem iguais...
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  tipoUsuario: 'CLIENTE' | 'ORGANIZADOR';
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cliente extends Usuario {
  pushToken?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface Organizador extends Usuario {
  nomeEmpresa: string;
  cnpj?: string;
  descricao?: string;
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE';
}

export interface Excursao {
  id: string;
  titulo: string;
  descricao: string;
  dataSaida: string;
  dataRetorno?: string;
  preco: number;
  vagasTotal: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
  localSaida: string;
  localDestino: string;
  observacoes?: string;
  imagens: string[];
  aceitaPix: boolean;
  aceitaCartao: boolean;
  status: 'ATIVA' | 'INATIVA' | 'CANCELADA' | 'FINALIZADA';
  organizador: Organizador;
  createdAt: string;
}

export interface Inscricao {
  id: string;
  valorPago: number;
  statusPagamento: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
  observacoesCliente?: string;
  excursao: Excursao;
  cliente: Cliente;
  createdAt: string;
}

export interface Pagamento {
  id: string;
  valor: number;
  metodoPagamento: 'PIX' | 'CARTAO_CREDITO';
  status: 'PENDENTE' | 'PROCESSANDO' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
  qrCode?: string;
  qrCodeBase64?: string;
  mercadoPagoPaymentId?: string;
  linkPagamento?: string;
  dataVencimento?: string;
  dataProcessamento?: string;
  observacoes?: string;
}

export interface DashboardData {
  totalExcursoes: number;
  excursoesMes: number;
  excursoesAtivas: number;
  receitaTotal: number;
  receitaMes: number;
  totalInscricoes: number;
  inscricoesPendentes: number;
  inscricoesAprovadas: number;
  taxaOcupacaoMedia: number;
  clientesUnicos: number;
  ticketMedio: number;
  notificacoesEnviadas: number;
  periodoInicio?: string;
  periodoFim?: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'SUCESSO' | 'AVISO' | 'ERRO';
  enviadaEm?: string;
  enviarParaTodos: boolean;
  enviada: boolean;
  excursaoId?: string;
  tituloExcursao?: string;
  totalDestinatarios?: number;
  createdAt: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status: number;
}

interface PageResponse<T> {
  content: T[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// Auth Service
export const authService = {
  registerCliente: async (data: {
    nome: string;
    email: string;
    password: string;
    telefone: string;
  }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/auth/cadastro/cliente', data);
  },

  registerOrganizador: async (data: {
    nome: string;
    email: string;
    password: string;
    telefone: string;
    nomeEmpresa: string;
    cnpj?: string;
  }): Promise<AxiosResponse<ApiResponse<any>>> => {
    return api.post('/auth/cadastro/organizador', data);
  },

  // Método corrigido para completar perfil do Google
  completeGoogleProfile: async (data: {
    tipoUsuario: 'CLIENTE' | 'ORGANIZADOR';
    nome: string;
    telefone: string;
    nomeEmpresa?: string;
    cnpj?: string;
    descricao?: string;
  }): Promise<AxiosResponse<ApiResponse<any>>> => {
    try {
      console.log('🔧 Completando perfil Google:', data);
      
      // Garantir que o token seja obtido
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      console.log('✅ Token obtido para complete-profile');

      // Fazer requisição com token explícito
      const response = await api.post('/auth/complete-profile', data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Perfil completado com sucesso');
      return response;
    } catch (error) {
      console.error('❌ Erro ao completar perfil:', error);
      throw error;
    }
  },

  refreshToken: async (refreshToken: string): Promise<AxiosResponse<any>> => {
    return api.post('/auth/refresh', { refreshToken });
  },

  getUserInfo: async (): Promise<AxiosResponse<ApiResponse<Usuario>>> => {
    return api.get('/auth/me');
  },
};

export const excursoesService = {
  criarExcursao: async (formData: FormData): Promise<AxiosResponse<any>> => {
    // Erro automaticamente interceptado e mostrado como tooltip
    return api.post('/organizador/excursoes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  listarExcursoes: async (params?: any): Promise<AxiosResponse<any>> => {
    return api.get('/organizador/excursoes', { params });
  },

  obterExcursao: async (id: string): Promise<AxiosResponse<any>> => {
    return api.get(`/organizador/excursoes/${id}`);
  },

  atualizarExcursao: async (id: string, formData: FormData): Promise<AxiosResponse<any>> => {
    return api.put(`/organizador/excursoes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  alterarStatus: async (id: string, status: string): Promise<AxiosResponse<ApiResponse<Excursao>>> => {
    return api.patch(`/organizador/excursoes/${id}/status`, null, {
      params: { status },
    });
  },

  excluirExcursao: async (id: string): Promise<AxiosResponse<void>> => {
    return api.delete(`/organizador/excursoes/${id}`);
  },

  // Public endpoints
  obterExcursaoPublica: async (id: string): Promise<AxiosResponse<ApiResponse<Excursao>>> => {
    return api.get(`/public/excursoes/${id}`);
  },

  inscreverse: async (excursaoId: string, data: {
    observacoesCliente?: string;
  }): Promise<AxiosResponse<ApiResponse<Inscricao>>> => {
    return api.post(`/public/excursoes/${excursaoId}/inscricoes`, data);
  },
};

// Cliente Service
export const clienteService = {
  obterPerfil: async (): Promise<AxiosResponse<ApiResponse<Cliente>>> => {
    return api.get('/cliente/perfil');
  },

  atualizarPerfil: async (data: Partial<Cliente>): Promise<AxiosResponse<ApiResponse<Cliente>>> => {
    return api.put('/cliente/perfil', data);
  },

  getInscricoes: async (params?: {
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<ApiResponse<PageResponse<Inscricao>>>> => {
    return api.get('/cliente/inscricoes', { params });
  },

  obterInscricao: async (id: string): Promise<AxiosResponse<ApiResponse<Inscricao>>> => {
    return api.get(`/cliente/inscricoes/${id}`);
  },

  atualizarPushToken: async (pushToken: string): Promise<AxiosResponse<void>> => {
    return api.put('/cliente/notificacoes/push-token', null, {
      params: { pushToken },
    });
  },

  atualizarConfiguracoes: async (
    emailNotifications: boolean,
    smsNotifications: boolean
  ): Promise<AxiosResponse<void>> => {
    return api.put('/cliente/notificacoes/configuracoes', null, {
      params: { emailNotifications, smsNotifications },
    });
  },
};

// Organizador Service
export const organizadorService = {
  obterPerfil: async (): Promise<AxiosResponse<ApiResponse<Organizador>>> => {
    return api.get('/organizador/perfil');
  },

  atualizarPerfil: async (data: Partial<Organizador>): Promise<AxiosResponse<ApiResponse<Organizador>>> => {
    return api.put('/organizador/perfil', data);
  },

  getDashboard: async (dataInicio?: string, dataFim?: string): Promise<AxiosResponse<ApiResponse<DashboardData>>> => {
    const params: any = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    return api.get('/organizador/dashboard', { params });
  },

  listarTodasInscricoes: async (params?: {
    excursaoId?: string;
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<ApiResponse<PageResponse<Inscricao>>>> => {
    return api.get('/organizador/inscricoes', { params });
  },
};

// Pagamentos Service
export const pagamentosService = {
  criarPagamentoPix: async (inscricaoId: string): Promise<AxiosResponse<ApiResponse<Pagamento>>> => {
    return api.post('/pagamentos/pix', { inscricaoId });
  },

  criarPagamentoCartao: async (data: {
    inscricaoId: string;
    numeroCartao: string;
    nomeCartao: string;
    mesExpiracao: string;
    anoExpiracao: string;
    cvv: string;
    parcelas?: number;
  }): Promise<AxiosResponse<ApiResponse<Pagamento>>> => {
    return api.post('/pagamentos/cartao', data);
  },
};

// Notificações Service
export const notificacoesService = {
  criarNotificacao: async (data: {
    titulo: string;
    mensagem: string;
    tipo?: string;
    excursaoId?: string;
    clientesAlvo?: string[];
    enviarParaTodos?: boolean;
  }): Promise<AxiosResponse<ApiResponse<Notificacao>>> => {
    return api.post('/organizador/notificacoes', data);
  },

  enviarNotificacao: async (id: string): Promise<AxiosResponse<void>> => {
    return api.post(`/organizador/notificacoes/${id}/enviar`);
  },

  listarNotificacoes: async (params?: {
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<ApiResponse<PageResponse<Notificacao>>>> => {
    return api.get('/organizador/notificacoes', { params });
  },

  listarClientesPorExcursao: async (excursaoId: string): Promise<AxiosResponse<ApiResponse<Cliente[]>>> => {
    return api.get(`/organizador/notificacoes/clientes/${excursaoId}`);
  },
};

// Utility functions
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Função de debug para verificar estado da autenticação
export const debugAuthToken = async () => {
  const token = await getAuthToken();
  console.log('🔍 Debug do token:', {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'null',
    localStorage: typeof window !== 'undefined' ? (localStorage.getItem('token') ? 'exists' : 'null') : 'server',
    sessionToken: (await getSession())?.accessToken ? 'exists' : 'null'
  });
  return token;
};

// Função para limpar tokens (logout)
export const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    console.log('🧹 Tokens limpos');
  }
};

export default api;