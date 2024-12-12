import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
    }

    // Criar usuário como empresa
    const user = await prisma.user.create({
      data: {
        email,
        name,
        type: "empresa",
        role: "admin",
        emailVerified: new Date()
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao registrar empresa:", error);
    return NextResponse.json(
      { error: "Erro ao criar empresa" },
      { status: 500 }
    );
  }
}
