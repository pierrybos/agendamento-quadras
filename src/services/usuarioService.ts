import { prisma } from "@/lib/prisma";

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });
  return user?.role; // Retorna o papel do usuário (admin, gerente, cliente)
}

export async function getUserById(userId: string) {
  return await prisma.user.findUnique({
    where: { id: Number(userId) },
  });
}

export async function getUsersByEmpresa(empresaId: string) {
  return await prisma.user.findMany({
    where: { companyId: Number(empresaId) },
  });
}