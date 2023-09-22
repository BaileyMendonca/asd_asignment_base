/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `technicianId` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `AppointmentID` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Date` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IsRequested` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LockerNumber` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ServiceID` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Time` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_technicianId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "id",
DROP COLUMN "serviceId",
DROP COLUMN "technicianId",
ADD COLUMN     "AppointmentID" INTEGER NOT NULL,
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "IsRequested" BOOLEAN NOT NULL,
ADD COLUMN     "LockerNumber" INTEGER NOT NULL,
ADD COLUMN     "ServiceID" INTEGER NOT NULL,
ADD COLUMN     "TechnicianID" INTEGER,
ADD COLUMN     "Time" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("AppointmentID");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_ServiceID_fkey" FOREIGN KEY ("ServiceID") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_TechnicianID_fkey" FOREIGN KEY ("TechnicianID") REFERENCES "Technician"("id") ON DELETE SET NULL ON UPDATE CASCADE;
