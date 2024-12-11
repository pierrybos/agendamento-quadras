import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID não fornecido" }), { status: 400 });
    }

    await prisma.quadra.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ message: "Quadra excluída com sucesso" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao excluir quadra" }), { status: 500 });
  }
}
