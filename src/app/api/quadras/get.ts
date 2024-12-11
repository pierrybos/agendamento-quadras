import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const quadras = await prisma.quadra.findMany();
    return new Response(JSON.stringify(quadras), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao listar quadras" }), { status: 500 });
  }
}
