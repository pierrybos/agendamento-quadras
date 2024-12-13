import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Listar todas as quadras
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Se o usuário for uma empresa, retorna apenas as quadras dela
    if (session.user.type === 'empresa') {
      const empresa = await prisma.empresa.findUnique({
        where: { userId: session.user.id },
        include: { 
          quadras: {
            include: {
              horarios: true,
              empresa: true
            }
          }
        }
      });

      return new Response(JSON.stringify(empresa?.quadras || []), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Se for um cliente, retorna todas as quadras
    const quadras = await prisma.quadra.findMany({
      include: { 
        empresa: {
          include: {
            user: true
          }
        },
        horarios: true
      }
    });

    return new Response(JSON.stringify(quadras), {
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

// Criar uma nova quadra
export async function POST(req: Request) {
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

    const data = await req.json();
    const quadra = await prisma.quadra.create({
      data: {
        ...data,
        empresaId: empresa.id
      }
    });

    return new Response(JSON.stringify(quadra), {
      status: 201,
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

// Atualizar uma quadra existente
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.type !== 'empresa') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const { id, name, location, description, available } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID da quadra é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedQuadra = await prisma.quadra.update({
      where: { id },
      data: { 
        ...(name && { name }),
        ...(location && { location }),
        ...(description !== undefined && { description }),
        ...(available !== undefined && { available }),
      },
    });

    return new Response(JSON.stringify(updatedQuadra), { 
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao atualizar quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao atualizar quadra" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Excluir uma quadra (exclusão lógica)
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.type !== 'empresa') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID da quadra é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Realiza exclusão lógica
    const deletedQuadra = await prisma.quadra.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return new Response(JSON.stringify(deletedQuadra), { 
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao excluir quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao excluir quadra" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
