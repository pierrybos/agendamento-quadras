import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('Found users:', users.length); // Debug log

    return NextResponse.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao listar usuários' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, type, role } = body;

    console.log('Update request:', { id, type, role }); // Debug log

    if (!id || !type || !role) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Validar valores permitidos
    const allowedTypes = ['cliente', 'mensalista', 'gerente'];
    const allowedRoles = ['user', 'admin'];

    if (!allowedTypes.includes(type) || !allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Tipo ou função inválida' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { type, role },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        role: true,
      },
    });

    console.log('Updated user:', updatedUser); // Debug log

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}
