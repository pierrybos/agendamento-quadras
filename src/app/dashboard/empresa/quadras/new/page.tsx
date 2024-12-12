'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

export default function NovaQuadra() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.type !== 'empresa') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      description: formData.get('description'),
      precoNormal: parseFloat(formData.get('precoNormal') as string),
      precoMensalista: parseFloat(formData.get('precoMensalista') as string),
    };

    try {
      const response = await fetch('/api/quadras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar quadra');
      }

      router.push('/dashboard/empresa');
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao criar quadra');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/dashboard/empresa" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova Quadra</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Quadra</Label>
              <Input id="name" name="name" required />
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <Input id="location" name="location" required />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" />
            </div>

            <div>
              <Label htmlFor="precoNormal">Preço Normal (R$)</Label>
              <Input 
                id="precoNormal" 
                name="precoNormal" 
                type="number" 
                step="0.01" 
                min="0" 
                required 
              />
            </div>

            <div>
              <Label htmlFor="precoMensalista">Preço Mensalista (R$)</Label>
              <Input 
                id="precoMensalista" 
                name="precoMensalista" 
                type="number" 
                step="0.01" 
                min="0" 
                required 
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Link href="/dashboard/empresa">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Quadra'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
