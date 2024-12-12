import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Buscar uma quadra específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Se for uma empresa, verifica se a quadra pertence a ela
    if (session.user.type === 'empresa') {
      const empresa = await prisma.empresa.findUnique({
        where: { userId: session.user.id }
      });

      if (!empresa) {
        return new Response(JSON.stringify({ error: 'Empresa não encontrada' }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      const quadra = await prisma.quadra.findFirst({
        where: {
          id: params.id,
          empresaId: empresa.id
        }
      });

      if (!quadra) {
        return new Response(JSON.stringify({ error: 'Quadra não encontrada' }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(quadra), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Se for um cliente, retorna a quadra se ela existir
    const quadra = await prisma.quadra.findUnique({
      where: { id: params.id },
      include: { empresa: true }
    });

    if (!quadra) {
      return new Response(JSON.stringify({ error: 'Quadra não encontrada' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(quadra), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Atualizar uma quadra específica
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.type !== 'empresa') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const empresa = await prisma.empresa.findUnique({
      where: { userId: session.user.id }
    });

    if (!empresa) {
      return new Response(JSON.stringify({ error: 'Empresa não encontrada' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verifica se a quadra pertence à empresa
    const quadraExistente = await prisma.quadra.findFirst({
      where: {
        id: params.id,
        empresaId: empresa.id
      }
    });

    if (!quadraExistente) {
      return new Response(JSON.stringify({ error: 'Quadra não encontrada' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await req.json();
    const quadra = await prisma.quadra.update({
      where: { id: params.id },
      data
    });

    return new Response(JSON.stringify(quadra), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Excluir uma quadra específica
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.type !== 'empresa') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const empresa = await prisma.empresa.findUnique({
      where: { userId: session.user.id }
    });

    if (!empresa) {
      return new Response(JSON.stringify({ error: 'Empresa não encontrada' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verifica se a quadra pertence à empresa
    const quadraExistente = await prisma.quadra.findFirst({
      where: {
        id: params.id,
        empresaId: empresa.id
      }
    });

    if (!quadraExistente) {
      return new Response(JSON.stringify({ error: 'Quadra não encontrada' }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    await prisma.quadra.delete({
      where: { id: params.id }
    });

    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
