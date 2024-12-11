/*
  Warnings:

  - Added the required column `empresaId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Horario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Quadra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Horario" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quadra" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "mensalista" BOOLEAN,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'cliente';

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ownerId_key" ON "Empresa"("ownerId");

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quadra" ADD CONSTRAINT "Quadra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
