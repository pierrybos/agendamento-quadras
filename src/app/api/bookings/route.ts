import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { quadraId, horarioId, priceId } = body;

    // Buscar informações necessárias
    const quadra = await prisma.quadra.findUnique({
      where: { id: quadraId },
      include: { empresa: true },
    });

    const price = await prisma.price.findUnique({
      where: { id: priceId },
    });

    if (!quadra || !price) {
      return NextResponse.json(
        { error: 'Quadra ou preço não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o horário está disponível
    const horarioExistente = await prisma.agendamento.findFirst({
      where: {
        quadraId,
        horarioId,
        isActive: true,
        status: {
          in: ['pending', 'confirmed'],
        },
      },
    });

    if (horarioExistente) {
      return NextResponse.json(
        { error: 'Horário já está agendado' },
        { status: 400 }
      );
    }

    // Criar o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        userId: session.user.id,
        quadraId,
        horarioId,
        empresaId: quadra.empresaId,
        totalValue: price.value,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'pix',
      },
    });

    return NextResponse.json(agendamento);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = session.user.id;

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        quadra: true,
        horario: true,
        empresa: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    );
  }
}
