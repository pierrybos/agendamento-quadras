import { prisma } from "@/lib/prisma";

export async function getQuadrasByEmpresa(empresaId: string) {
  return await prisma.quadra.findMany({
    where: { empresaId: Number(empresaId), isActive: true },
    include: { horarios: true, prices: true },
  });
}

export async function isQuadraAvailable(quadraId: string, horarioId: string) {
  const booking = await prisma.agendamento.findFirst({
    where: { quadraId: Number(quadraId), horarioId: Number(horarioId), isActive: true },
  });
  return !booking; // Retorna true se está disponível
}