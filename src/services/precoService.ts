import { prisma } from "@/lib/prisma";

export async function getPricesByEmpresa(empresaId: string) {
  return await prisma.price.findMany({
    where: { empresaId: Number(empresaId), isActive: true },
  });
}

export async function calculatePrice(quadraId: string, duration: number, isMensalista: boolean) {
  const prices = await prisma.quadraPrice.findMany({
    where: { quadraId: Number(quadraId) },
    include: { price: true },
  });

  const price = isMensalista
    ? prices.find(p => p.price.type === "mensalista")?.price.value
    : prices.find(p => p.price.type === "normal")?.price.value;

  if (!price) throw new Error("Preço não encontrado");

  return price * duration;
}