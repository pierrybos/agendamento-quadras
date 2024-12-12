import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Dados recebidos:', data);

    const { userId, empresaName, contact, quadras } = data;

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe e se já tem uma empresa
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { empresaOwned: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    console.log('Usuário encontrado:', user);

    if (user.empresaOwned) {
      return NextResponse.json(
        { error: 'Usuário já possui uma empresa cadastrada' },
        { status: 400 }
      );
    }

    // Criar empresa
    const empresa = await prisma.empresa.create({
      data: {
        name: empresaName,
        contact: contact,
        userId: userId,
      },
    });

    console.log('Empresa criada:', empresa);

    // Criar as quadras
    const quadrasPromises = quadras.map((quadra: any) =>
      prisma.quadra.create({
        data: {
          name: quadra.name,
          location: quadra.location,
          description: quadra.description,
          precoNormal: quadra.precos.normal,
          precoMensalista: quadra.precos.mensalista,
          empresaId: empresa.id,
        },
      })
    );

    const createdQuadras = await Promise.all(quadrasPromises);
    console.log('Quadras criadas:', createdQuadras);

    // Atualizar o usuário para tipo empresa
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        type: 'empresa',
      },
    });

    console.log('Usuário atualizado:', updatedUser);

    return NextResponse.json({ 
      success: true,
      empresa,
      quadras: createdQuadras
    });
  } catch (error: any) {
    console.error('Erro ao completar registro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao completar o cadastro' },
      { status: 500 }
    );
  }
}
