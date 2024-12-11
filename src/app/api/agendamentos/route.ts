import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      where: { isActive: true },
      include: {
        quadra: true,
        horario: true,
        user: true,
      },
    });

    return new Response(JSON.stringify(agendamentos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao listar agendamentos" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        userId: body.userId,
        quadraId: body.quadraId,
        horarioId: body.horarioId,
        status: body.status || "pending",
        totalValue: body.totalValue,
        paymentStatus: body.paymentStatus || "pending",
        paymentMethod: body.paymentMethod || "pix",
        paymentReference: body.paymentReference || null,
      },
    });

    return new Response(JSON.stringify(novoAgendamento), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao criar agendamento" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: body.id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        paymentReference: body.paymentReference,
      },
    });

    return new Response(JSON.stringify(agendamentoAtualizado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao atualizar agendamento" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const agendamentoDesativado = await prisma.agendamento.update({
      where: { id },
      data: { isActive: false },
    });

    return new Response(
      JSON.stringify({ message: "Agendamento removido com sucesso" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao remover agendamento" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
