import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const {
      empresaName,
      address,
      contact,
      ownerName,
      ownerEmail,
      ownerPassword,
      ownerPhone,
    } = await req.json();

    // Verificar se já existe uma empresa com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Criar o usuário owner
    const hashedPassword = await hash(ownerPassword, 10);
    
    // Criar empresa e usuário em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Primeiro criar o usuário
      const user = await tx.user.create({
        data: {
          email: ownerEmail,
          name: ownerName,
          phone: ownerPhone,
          password: hashedPassword,
          type: "empresa",  // Garantir que o tipo seja empresa
          role: "admin",    // Garantir que o papel seja admin
          emailVerified: new Date(), // Marcar como verificado já que temos a senha
        },
      });

      // Depois criar a empresa
      const empresa = await tx.empresa.create({
        data: {
          name: empresaName,
          address,
          contact,
          ownerId: user.id,
          isActive: true,
        },
      });

      // Atualizar o usuário com o ID da empresa
      await tx.user.update({
        where: { id: user.id },
        data: { companyId: empresa.id },
      });

      return { user, empresa };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao registrar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao criar empresa" },
      { status: 500 }
    );
  }
}
