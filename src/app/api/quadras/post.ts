import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, description } = body;

    const newQuadra = await prisma.quadra.create({
      data: { name, location, description },
    });

    return new Response(JSON.stringify(newQuadra), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao criar quadra" }), { status: 500 });
  }
}
