'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Horario {
  start: string;
  end: string;
}

interface Quadra {
  name: string;
  location: string;
}

interface Empresa {
  name: string;
}

interface Agendamento {
  id: number;
  status: string;
  totalValue: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  horario: Horario;
  quadra: Quadra;
  empresa: Empresa;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Erro ao carregar agendamentos');
        }
        const data = await response.json();
        setAgendamentos(data);
      } catch (error) {
        setError('Erro ao carregar seus agendamentos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchAgendamentos();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      cancelled: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const formatPaymentStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendente',
      paid: 'Pago',
      failed: 'Falhou',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Meus Agendamentos</h1>

      {agendamentos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Você ainda não tem nenhum agendamento.</p>
          <a
            href="/agendamento"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Fazer um Agendamento
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {agendamentos.map((agendamento) => (
            <div
              key={agendamento.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{agendamento.quadra.name}</h2>
                  <p className="text-gray-600">{agendamento.empresa.name}</p>
                  <p className="text-gray-500 text-sm">{agendamento.quadra.location}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      agendamento.status
                    )}`}
                  >
                    {formatStatus(agendamento.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Data e Hora</p>
                  <p className="font-medium">
                    {new Date(agendamento.horario.start).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm">
                    {new Date(agendamento.horario.start).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(agendamento.horario.end).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="font-medium">R$ {agendamento.totalValue.toFixed(2)}</p>
                  <p className="text-sm">{agendamento.paymentMethod.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pagamento</p>
                  <p className="font-medium">{formatPaymentStatus(agendamento.paymentStatus)}</p>
                  <p className="text-sm">
                    Agendado em{' '}
                    {new Date(agendamento.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              {agendamento.status === 'pending' && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      // Implementar cancelamento
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Cancelar
                  </button>
                  {agendamento.paymentStatus === 'pending' && (
                    <button
                      onClick={() => {
                        // Implementar pagamento
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      Pagar Agora
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
