/*
  Warnings:

  - You are about to drop the column `TechnicianID` on the `Availabilities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Availabilities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availabilities" DROP COLUMN "TechnicianID",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Availabilities_email_key" ON "Availabilities"("email");
