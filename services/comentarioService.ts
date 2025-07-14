import api from './api';
import { Comentario } from '../types';

class ComentarioService {
  async listar(excursaoId: string) {
    const response = await api.get(`/public/excursoes/${excursaoId}/comentarios`);
    return response.data.data as Comentario[];
  }

  async criar(excursaoId: string, mensagem: string) {
    const response = await api.post(`/cliente/excursoes/${excursaoId}/comentarios`, { mensagem });
    return response.data.data as Comentario;
  }
}

export default new ComentarioService();
