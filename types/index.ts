export interface User {
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

export interface Cliente extends User {
  pushToken?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
}

export interface Organizador extends User {
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
  proximasExcursoes?: Excursao[];
  inscricoesRecentes?: Inscricao[];
  inscricoesConfirmadas?: number;
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

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  status: number;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PageResponse<T> {
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
    sort?: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  userType: 'CLIENTE' | 'ORGANIZADOR';
}

export interface RegisterClienteForm {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefone: string;
  acceptTerms: boolean;
}

export interface RegisterOrganizadorForm extends RegisterClienteForm {
  nomeEmpresa: string;
  cnpj?: string;
}

export interface ExcursaoForm {
  titulo: string;
  descricao: string;
  dataSaida: string;
  dataRetorno?: string;
  preco: number;
  vagasTotal: number;
  localSaida: string;
  localDestino: string;
  observacoes?: string;
  aceitaPix: boolean;
  aceitaCartao: boolean;
  imagens: File[];
}

export interface InscricaoForm {
  observacoesCliente?: string;
}

export interface PagamentoPixForm {
  inscricaoId: string;
}

export interface PagamentoCartaoForm {
  inscricaoId: string;
  numeroCartao: string;
  nomeCartao: string;
  mesExpiracao: string;
  anoExpiracao: string;
  cvv: string;
  parcelas: number;
}

export interface NotificacaoForm {
  titulo: string;
  mensagem: string;
  tipo: 'INFO' | 'SUCESSO' | 'AVISO' | 'ERRO';
  excursaoId?: string;
  clientesAlvo?: string[];
  enviarParaTodos: boolean;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: ValidationError[];
}

// Utility types
export type ExcursaoStatus = 'ATIVA' | 'INATIVA' | 'CANCELADA' | 'FINALIZADA';
export type PagamentoStatus = 'PENDENTE' | 'PROCESSANDO' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
export type NotificacaoTipo = 'INFO' | 'SUCESSO' | 'AVISO' | 'ERRO';
export type UserType = 'CLIENTE' | 'ORGANIZADOR';
export type MetodoPagamento = 'PIX' | 'CARTAO_CREDITO';