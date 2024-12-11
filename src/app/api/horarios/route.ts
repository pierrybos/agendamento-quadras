import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quadraId = searchParams.get("quadraId");
    const empresaId = searchParams.get("empresaId");

    const horarios = await prisma.horario.findMany({
      where: {
        isActive: true,
        ...(quadraId ? { quadraId: parseInt(quadraId) } : {}),
        ...(empresaId ? { empresaId: parseInt(empresaId) } : {}),
      },
      include: {
        quadra: true,
        empresa: true,
        agendamentos: true,
      },
    });

    return new Response(JSON.stringify(horarios), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao listar horários:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao listar horários" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { start, end, quadraId, empresaId } = body;

    const novoHorario = await prisma.horario.create({
      data: {
        start: new Date(start),
        end: new Date(end),
        quadraId,
        empresaId,
      },
    });

    return new Response(JSON.stringify(novoHorario), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao criar horário:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar horário" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}



export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, start, end, quadraId, empresaId } = body;

    const horarioAtualizado = await prisma.horario.update({
      where: { id },
      data: {
        start: new Date(start),
        end: new Date(end),
        quadraId,
        empresaId,
      },
    });

    return new Response(JSON.stringify(horarioAtualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao atualizar horário:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar horário" }),
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

    const horarioDesativado = await prisma.horario.update({
      where: { id },
      data: { isActive: false },
    });

    return new Response(
      JSON.stringify({ message: "Horário desativado com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro ao excluir horário:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao excluir horário" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
