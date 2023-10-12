-- CreateTable
CREATE TABLE "Availabilities" (
    "id" SERIAL NOT NULL,
    "TechnicianID" INTEGER NOT NULL,
    "Day" TEXT NOT NULL,
    "StartTime" TIMESTAMP(3) NOT NULL,
    "EndTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Availabilities_pkey" PRIMARY KEY ("id")
);
