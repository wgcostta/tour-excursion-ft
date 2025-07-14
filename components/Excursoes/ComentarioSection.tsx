import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import comentarioService from '../../services/comentarioService';
import { Comentario } from '../../types';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  excursaoId: string;
}

const ComentarioSection: React.FC<Props> = ({ excursaoId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const { register, handleSubmit, reset } = useForm<{ mensagem: string }>();

  useEffect(() => {
    async function load() {
      try {
        const data = await comentarioService.listar(excursaoId);
        setComentarios(data);
      } catch (err) {
        console.error('Erro ao carregar comentários', err);
      }
    }
    load();
  }, [excursaoId]);

  const onSubmit = async (data: { mensagem: string }) => {
    try {
      const novo = await comentarioService.criar(excursaoId, data.mensagem);
      setComentarios((prev) => [novo, ...prev]);
      reset();
    } catch (err) {
      console.error('Erro ao enviar comentário', err);
    }
  };

  if (!session) {
    const loginUrl = `/auth/login?callbackUrl=${encodeURIComponent(router.asPath)}`;
    const registerUrl = `/auth/register?callbackUrl=${encodeURIComponent(router.asPath)}`;
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">Entre para comentar sobre a excursão.</p>
        <div className="flex space-x-2">
          <Link href={loginUrl} className="btn-primary flex-1 text-center">Entrar</Link>
          <Link href={registerUrl} className="btn-outline flex-1 text-center">Criar conta</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <textarea
          className="form-input w-full"
          placeholder="Deixe sua pergunta ou comentário"
          {...register('mensagem', { required: true })}
        />
        <button type="submit" className="btn-primary">Enviar</button>
      </form>

      <ul className="space-y-3">
        {comentarios.map((c) => (
          <li key={c.id} className="border rounded p-3">
            <div className="text-sm font-semibold">{c.autor.nome}</div>
            <div className="text-sm text-gray-600">{new Date(c.createdAt).toLocaleString('pt-BR')}</div>
            <p className="mt-1 text-gray-800">{c.mensagem}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComentarioSection;
