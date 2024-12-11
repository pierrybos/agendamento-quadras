import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req: Request) {
  try {
    const horarios = await prisma.horario.findMany({
      where: { isActive: true },
      include: { quadra: true },
    });

    return new Response(JSON.stringify(horarios), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log('error');
    console.log('error');
    console.log('error');
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Erro ao listar horários" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { start, end, quadraId } = body;

    const novoHorario = await prisma.horario.create({
      data: { start: new Date(start), end: new Date(end), quadraId },
    });

    return new Response(JSON.stringify(novoHorario), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao criar horário" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}



export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, start, end, quadraId } = body;

    const horarioAtualizado = await prisma.horario.update({
      where: { id },
      data: { start: new Date(start), end: new Date(end), quadraId },
    });

    return new Response(JSON.stringify(horarioAtualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar horário" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
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

    await prisma.horario.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Horário excluído com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao excluir horário" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
