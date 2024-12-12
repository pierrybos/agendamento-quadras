import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
     
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const quadras = await prisma.quadra.findMany({
      where: {
        isActive: true,
        available: true,
      },
      include: {
        empresa: {
          select: {
            name: true,
          },
        },
        prices: {
          include: {
            price: true,
          },
        },
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
      },
    });

    return NextResponse.json(quadras);
  } catch (error) {
    console.error('Erro ao buscar quadras:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar quadras' },
      { status: 500 }
    );
  }
}
