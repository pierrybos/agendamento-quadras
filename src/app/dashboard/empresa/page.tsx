'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from 'next/link';

interface Quadra {
  id: string;
  name: string;
  location: string;
  description?: string;
  precoNormal: number;
  precoMensalista: number;
}

export default function DashboardEmpresa() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.type !== 'empresa') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/quadras')
        .then(res => res.json())
        .then(data => {
          setQuadras(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching quadras:', error);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard da Empresa</h1>
        <Link href="/dashboard/empresa/quadras/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Quadra
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quadras.length > 0 && quadras.map((quadra) => (
          <Card key={quadra.id}>
            <CardHeader>
              <CardTitle>{quadra.name}</CardTitle>
              <CardDescription>{quadra.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{quadra.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">Preço Normal:</p>
                  <p className="text-lg">R$ {quadra.precoNormal.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Preço Mensalista:</p>
                  <p className="text-lg">R$ {quadra.precoMensalista.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Link href={`/dashboard/empresa/quadras/${quadra.id}/edit`}>
                  <Button variant="outline">Editar</Button>
                </Link>
                <Link href={`/dashboard/empresa/quadras/${quadra.id}/agenda`}>
                  <Button>Ver Agenda</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
