import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, location, description } = body;

    const updatedQuadra = await prisma.quadra.update({
      where: { id: Number(id) },
      data: { name, location, description },
    });

    return new Response(JSON.stringify(updatedQuadra), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao editar quadra" }), { status: 500 });
  }
}
