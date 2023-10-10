/*
  Warnings:

  - You are about to drop the column `email` on the `Technician` table. All the data in the column will be lost.
  - Added the required column `currentPoints` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Technician_email_key";

-- AlterTable
ALTER TABLE "Technician" DROP COLUMN "email",
ADD COLUMN     "WorkingDays" TEXT[],
ADD COLUMN     "currentPoints" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "technicianId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "Technician"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
