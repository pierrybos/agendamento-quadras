'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type QuadraInput = {
  name: string;
  location: string;
  description: string;
  precos: {
    normal: number;
    mensalista: number;
  };
};

export default function CompleteEmpresaRegistration() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quadras, setQuadras] = useState<QuadraInput[]>([{
    name: '',
    location: '',
    description: '',
    precos: {
      normal: 0,
      mensalista: 0
    }
  }]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/register/empresa');
    } else {
      console.log('Session user:', session.user);
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>;
  }

  if (!session?.user) {
    return null;
  }

  const addQuadra = () => {
    setQuadras([...quadras, {
      name: '',
      location: '',
      description: '',
      precos: {
        normal: 0,
        mensalista: 0
      }
    }]);
  };

  const removeQuadra = (index: number) => {
    setQuadras(quadras.filter((_, i) => i !== index));
  };

  const updateQuadra = (index: number, field: keyof QuadraInput, value: any) => {
    const newQuadras = [...quadras];
    if (field === 'precos') {
      newQuadras[index][field] = { ...newQuadras[index][field], ...value };
    } else {
      newQuadras[index][field] = value;
    }
    setQuadras(newQuadras);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verificar se temos o ID do usuário
      if (!session.user.id) {
        throw new Error('ID do usuário não encontrado na sessão');
      }

      // Validar quadras
      const quadrasValidas = quadras.every(quadra => 
        quadra.name && 
        quadra.location && 
        quadra.precos.normal > 0 && 
        quadra.precos.mensalista > 0
      );

      if (!quadrasValidas) {
        throw new Error('Por favor, preencha todos os campos obrigatórios das quadras');
      }

      const userData = {
        userId: session.user.id,
        empresaName: session.user.name || '', 
        contact: session.user.email || '',
        quadras: quadras.map(quadra => ({
          ...quadra,
          precos: {
            normal: Number(quadra.precos.normal),
            mensalista: Number(quadra.precos.mensalista)
          }
        }))
      };

      console.log('Enviando dados:', userData);

      const response = await fetch('/api/empresas/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const responseData = await response.json();
      console.log('Resposta:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao cadastrar empresa');
      }

      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erro:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Configure suas Quadras
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Olá {session.user.name}, vamos configurar suas quadras e preços
          </p>
        </div>

        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {quadras.map((quadra, index) => (
              <div key={index} className="border p-4 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Quadra {index + 1}</h3>
                  {quadras.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuadra(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nome da Quadra
                    </label>
                    <input
                      type="text"
                      required
                      value={quadra.name}
                      onChange={(e) => updateQuadra(index, 'name', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Localização
                    </label>
                    <input
                      type="text"
                      required
                      value={quadra.location}
                      onChange={(e) => updateQuadra(index, 'location', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição
                    </label>
                    <textarea
                      value={quadra.description}
                      onChange={(e) => updateQuadra(index, 'description', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço Normal (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={quadra.precos.normal}
                      onChange={(e) => updateQuadra(index, 'precos', { normal: parseFloat(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Preço Mensalista (R$)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={quadra.precos.mensalista}
                      onChange={(e) => updateQuadra(index, 'precos', { mensalista: parseFloat(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={addQuadra}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Adicionar Outra Quadra
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Salvando...' : 'Concluir Cadastro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
