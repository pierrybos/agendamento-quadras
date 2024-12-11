import { prisma } from "@/lib/prisma";
import { isQuadraAvailable } from "./quadraService";

export async function createBooking({ quadraId, horarioId, clienteId }: { quadraId: string; horarioId: string; clienteId: string }) {
  const available = await isQuadraAvailable(quadraId, horarioId);
  if (!available) throw new Error("Horário indisponível");

  return await prisma.agendamento.create({
    data: { quadraId: Number(quadraId), horarioId: Number(horarioId), userId: Number(clienteId), status: "pending" },
  });
}

export async function getBookingsByCliente(clienteId: string) {
  return await prisma.agendamento.findMany({
    where: { userId: Number(clienteId), isActive: true },
    include: { quadra: true, horario: true, empresa: true },
  });
}