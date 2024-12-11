import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const precos = await prisma.price.findMany({
      where: { isActive: true },
    });
    return new Response(JSON.stringify(precos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao listar preços" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { duration, type, value } = body;

    const novoPreco = await prisma.price.create({
      data: { duration, type, value },
    });

    return new Response(JSON.stringify(novoPreco), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao criar preço" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
    return new Response(JSON.stringify({ error: "Erro ao atualizar preço" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

    await prisma.price.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Preço excluído com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao excluir preço" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
