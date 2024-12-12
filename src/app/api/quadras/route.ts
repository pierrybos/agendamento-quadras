import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

// Listar todas as quadras
export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { searchParams } = new URL(req.url);
    const empresaId = searchParams.get("empresaId");

    const quadras = await prisma.quadra.findMany({
      where: {
        isActive: true,
        available: true,
        ...(empresaId ? { empresaId: parseInt(empresaId) } : {}),
      },
      include: { 
        empresa: true, 
        horarios: {
          where: {
            isActive: true,
            start: {
              gte: new Date(), // Apenas horários futuros
            },
          },
          orderBy: {
            start: 'asc',
          },
        },
        prices: {
          include: {
            price: true,
          },
          where: {
            price: {
              isActive: true,
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(quadras), { 
      status: 200, 
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao listar quadras:", error);
    return new Response(JSON.stringify({ error: "Erro ao listar quadras" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Criar uma nova quadra
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json();
    const { name, location, description, empresaId } = body;

    // Validações básicas
    if (!name || !location || !empresaId) {
      return new Response(JSON.stringify({ error: "Campos obrigatórios faltando" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newQuadra = await prisma.quadra.create({
      data: { 
        name, 
        location, 
        description, 
        empresaId,
        available: true,
        isActive: true,
      },
    });

    return new Response(JSON.stringify(newQuadra), { 
      status: 201, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Erro ao criar quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao criar quadra" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Atualizar uma quadra existente
export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
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
    const session = await getServerSession();
    
    if (!session?.user || session.user.role !== 'admin') {
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
