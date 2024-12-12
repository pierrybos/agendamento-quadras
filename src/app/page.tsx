'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">
          Bem-vindo, {session.user?.name}!
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Meu Perfil</h2>
            <div className="space-y-2">
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>Tipo:</strong> {session.user?.type || 'Cliente'}</p>
              <p><strong>Função:</strong> {session.user?.role || 'Usuário'}</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Menu Rápido</h2>
            <div className="space-y-4">
              <a
                href="/agendamento"
                className="block w-full p-3 text-center bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Agendar Quadra
              </a>
              <a
                href="/dashboard"
                className="block w-full p-3 text-center bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Meus Agendamentos
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
