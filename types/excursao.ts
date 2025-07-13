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
  organizador: import('./index').Organizador;
  createdAt: string;
}

export interface ExcursaoRequest {
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
}

export interface ExcursaoFilters {
  destino?: string;
  precoMin?: number | string;
  precoMax?: number | string;
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  page?: number;
  size?: number;
}
