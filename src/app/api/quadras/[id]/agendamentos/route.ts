import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Listar agendamentos de uma quadra
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

    const { searchParams } = new URL(req.url);
    const inicio = searchParams.get("inicio");
    const fim = searchParams.get("fim");

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        quadraId: params.id,
        ...(inicio && fim ? {
          dataInicio: {
            gte: new Date(inicio)
          },
          dataFim: {
            lte: new Date(fim)
          }
        } : {})
      },
      orderBy: {
        dataInicio: 'asc'
      }
    });

    return new Response(JSON.stringify(agendamentos), {
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

// Criar novo agendamento
export async function POST(
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

    const data = await req.json();
    
    // Verifica se já existe agendamento no mesmo horário
    const conflito = await prisma.agendamento.findFirst({
      where: {
        quadraId: params.id,
        status: "confirmado",
        OR: [
          {
            AND: [
              { dataInicio: { lte: new Date(data.dataInicio) } },
              { dataFim: { gt: new Date(data.dataInicio) } }
            ]
          },
          {
            AND: [
              { dataInicio: { lt: new Date(data.dataFim) } },
              { dataFim: { gte: new Date(data.dataFim) } }
            ]
          }
        ]
      }
    });

    if (conflito) {
      return new Response(JSON.stringify({ error: 'Já existe um agendamento neste horário' }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        ...data,
        quadraId: params.id,
        dataInicio: new Date(data.dataInicio),
        dataFim: new Date(data.dataFim)
      }
    });

    return new Response(JSON.stringify(agendamento), {
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
