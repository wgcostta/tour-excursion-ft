import { useQuery, useMutation, useQueryClient } from 'react-query';
import excursaoService from '../services/excursaoService';
import { toast } from 'react-hot-toast';

export const useExcursoes = (filtros = {}) => {
  return useQuery(
    ['excursoes', filtros],
    () => excursaoService.listarExcursoes(filtros),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useExcursao = (id) => {
  return useQuery(
    ['excursao', id],
    () => excursaoService.obterExcursao(id),
    {
      enabled: !!id,
    }
  );
};

export const useExcursaoPublica = (id) => {
  return useQuery(
    ['excursao-publica', id],
    () => excursaoService.obterExcursaoPublica(id),
    {
      enabled: !!id,
    }
  );
};

export const useCriarExcursao = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ excursaoData, imagens }) => excursaoService.criarExcursao(excursaoData, imagens),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['excursoes']);
        toast.success('Excursão criada com sucesso!');
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao criar excursão');
      },
    }
  );
};

export const useAtualizarExcursao = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, excursaoData, imagens }) => excursaoService.atualizarExcursao(id, excursaoData, imagens),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['excursoes']);
        queryClient.invalidateQueries(['excursao', data.id]);
        toast.success('Excursão atualizada com sucesso!');
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao atualizar excursão');
      },
    }
  );
};

export const useAlterarStatusExcursao = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, status }) => excursaoService.alterarStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['excursoes']);
        queryClient.invalidateQueries(['excursao']);
        toast.success('Status alterado com sucesso!');
      },
      onError: (error) => {
        toast.error(error.message || 'Erro ao alterar status');
      },
    }
  );
};

