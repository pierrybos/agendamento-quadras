import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Listar todas as quadras
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const empresaId = searchParams.get("empresaId");

    const quadras = await prisma.quadra.findMany({
      where: {
        isActive: true,
        ...(empresaId ? { empresaId: parseInt(empresaId) } : {}),
      },
      include: { empresa: true, horarios: true, prices: true },
    });
    return new Response(JSON.stringify(quadras), { 
        status: 200, 
        headers: { "Content-Type": "application/json" },
     });
  } catch (error) {
    console.error("Erro ao listar quadras:", error);
    return new Response(JSON.stringify({ error: "Erro ao listar quadras" }), {
         status: 500,
         });
  }
}

// Criar uma nova quadra
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, description, empresaId } = body;

    const newQuadra = await prisma.quadra.create({
      data: { name, location, description, empresaId },
    });

    return new Response(JSON.stringify(newQuadra), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Erro ao criar quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao criar quadra" }), { status: 500 });
  }
}

// Atualizar uma quadra existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, location, description } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "ID é obrigatório para atualizar quadra" }), { status: 400 });
    }

    const updatedQuadra = await prisma.quadra.update({
      where: { id: Number(id) },
      data: { name, location, description },
    });

    return new Response(JSON.stringify(updatedQuadra), { status: 200, headers: { "Content-Type": "application/json" }, });
  } catch (error) {
    console.error("Erro ao atualizar quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao atualizar quadra" }), { status: 500 });
  }
}

// Excluir uma quadra
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID é obrigatório para excluir quadra" }), { status: 400 });
    }

    const quadraDesativada = await prisma.quadra.update({
      where: { id: Number(id) },
      data: { isActive: false },
    });

    return new Response(JSON.stringify({ message: "Quadra desativada com sucesso" }), { status: 200, headers: { "Content-Type": "application/json" }, });
  } catch (error) {
    console.error("Erro ao excluir quadra:", error);
    return new Response(JSON.stringify({ error: "Erro ao excluir quadra" }), { status: 500 });
  }
}
