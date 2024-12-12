'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  type: string;
  role: string;
}

export default function UserAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Erro ao carregar usuários');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Erro ao carregar usuários. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchUsers();
    }
  }, [session]);

  const handleUpdateUser = async (userId: string, type: string, role: string) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          type,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao atualizar usuário');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao atualizar usuário. Tente novamente mais tarde.');
      }
    }
  };

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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Administração de Usuários</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Função
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name || 'Sem nome'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      className="text-sm border rounded p-1"
                      defaultValue={user.type}
                      onChange={(e) => handleUpdateUser(user.id, e.target.value, user.role)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="mensalista">Mensalista</option>
                      <option value="gerente">Gerente</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900">{user.type}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <select
                      className="text-sm border rounded p-1"
                      defaultValue={user.role}
                      onChange={(e) => handleUpdateUser(user.id, user.type, e.target.value)}
                    >
                      <option value="user">Usuário</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900">{user.role}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingUser === user.id ? (
                    <button
                      onClick={() => setEditingUser(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
