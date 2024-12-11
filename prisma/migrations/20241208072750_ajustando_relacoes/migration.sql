/*
  Warnings:

  - You are about to drop the column `date` on the `Agendamento` table. All the data in the column will be lost.
  - Added the required column `horarioId` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "date",
ADD COLUMN     "horarioId" INTEGER NOT NULL,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'pix',
ADD COLUMN     "paymentReference" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Quadra" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "isWhatsApp" BOOLEAN,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuadraPrice" (
    "id" SERIAL NOT NULL,
    "quadraId" INTEGER NOT NULL,
    "priceId" INTEGER NOT NULL,

    CONSTRAINT "QuadraPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "quadraId" INTEGER NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuadraPrice" ADD CONSTRAINT "QuadraPrice_quadraId_fkey" FOREIGN KEY ("quadraId") REFERENCES "Quadra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuadraPrice" ADD CONSTRAINT "QuadraPrice_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "Price"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_quadraId_fkey" FOREIGN KEY ("quadraId") REFERENCES "Quadra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
