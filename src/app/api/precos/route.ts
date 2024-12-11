import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const empresaId = searchParams.get("empresaId"); // Filtra por empresa, se necessário

    const precos = await prisma.price.findMany({
      where: {
        isActive: true,
        ...(empresaId ? { empresaId: parseInt(empresaId) } : {}),
      },
      include: { quadras: true, empresa: true },
    });
    return new Response(JSON.stringify(precos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao listar preços:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao listar preços" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { duration, type, value, empresaId } = body;

    const novoPreco = await prisma.price.create({
      data: { duration, type, value, empresaId },
    });

    return new Response(JSON.stringify(novoPreco), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao criar preço:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar preço" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, duration, type, value } = body;

    const precoAtualizado = await prisma.price.update({
      where: { id },
      data: { duration, type, value },
    });

    return new Response(JSON.stringify(precoAtualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao atualizar preço:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar preço" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return new Response(JSON.stringify({ error: "ID inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const precoDesativado = await prisma.price.update({
      where: { id },
      data: { isActive: false },
    });

    return new Response(
      JSON.stringify({ message: "Preço excluído com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro ao excluir preço:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao excluir preço" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
