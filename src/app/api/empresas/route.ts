import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Apenas admin pode listar todas as empresas
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId"); // Filtrar empresas de um gerente específico

    const empresas = await prisma.empresa.findMany({
      where: ownerId ? { ownerId: parseInt(ownerId) } : { isActive: true },
      include: { quadras: true, precos: true, horarios: true },
    });

    return new Response(JSON.stringify(empresas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao listar empresas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const novaEmpresa = await prisma.empresa.create({
      data: {
        name: body.name,
        address: body.address,
        contact: body.contact,
        ownerId: body.ownerId,
      },
    });

    return new Response(JSON.stringify(novaEmpresa), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao criar empresa" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const empresaAtualizada = await prisma.empresa.update({
      where: { id: body.id },
      data: {
        name: body.name,
        address: body.address,
        contact: body.contact,
      },
    });

    return new Response(JSON.stringify(empresaAtualizada), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar empresa" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const empresaDesativada = await prisma.empresa.update({
      where: { id: body.id },
      data: { isActive: false },
    });

    return new Response(
      JSON.stringify({ message: "Empresa desativada com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao desativar empresa" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
