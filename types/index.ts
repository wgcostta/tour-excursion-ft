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
}

export interface Organizador extends User {
  nomeEmpresa: string;
  cnpj?: string;
  descricao?: string;
}

export interface Excursao {
  id: string;
  titulo: string;
  descricao: string;
  destino: string;
  dataIda: string;
  dataVolta?: string;
  horarioSaida: string;
  localSaida: string;
  preco: number;
  precoMenor?: number;
  vagasTotal: number;
  vagasDisponiveis: number;
  status: 'ATIVA' | 'INATIVA' | 'CANCELADA' | 'FINALIZADA';
  imagens: string[];
  organizador: Organizador;
  createdAt: string;
  updatedAt: string;
}

export interface Inscricao {
  id: string;
  nomeCompleto: string;
  telefone: string;
  documento: string;
  quantidadePessoas: number;
  valorTotal: number;
  status: 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA';
  observacoes?: string;
  excursao: Excursao;
  cliente: Cliente;
  pagamentos: Pagamento[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagamento {
  id: string;
  valor: number;
  metodoPagamento: 'PIX' | 'CARTAO_CREDITO';
  status: 'PENDENTE' | 'PROCESSANDO' | 'APROVADO' | 'REJEITADO' | 'CANCELADO';
  pixQrCode?: string;
  pixCopiaeCola?: string;
  mercadoPagoId?: string;
  paymentLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalExcursoes: number;
  excursoesAtivas: number;
  totalInscricoes: number;
  inscricoesConfirmadas: number;
  receitaTotal: number;
  receitaMesAtual: number;
  proximasExcursoes: Excursao[];
  inscricoesRecentes: Inscricao[];
}

