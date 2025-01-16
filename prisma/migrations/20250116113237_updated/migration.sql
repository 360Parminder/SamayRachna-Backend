/*
  Warnings:

  - You are about to drop the `Timetable` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mytimetable" JSONB;

-- DropTable
DROP TABLE "Timetable";

-- CreateTable
CREATE TABLE "timetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timetable" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);
