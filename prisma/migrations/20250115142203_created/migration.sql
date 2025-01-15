/*
  Warnings:

  - You are about to drop the column `day` on the `Timetable` table. All the data in the column will be lost.
  - You are about to drop the column `lecture` on the `Timetable` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Timetable` table. All the data in the column will be lost.
  - You are about to drop the column `teacher` on the `Timetable` table. All the data in the column will be lost.
  - Added the required column `name` to the `Timetable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timetable` to the `Timetable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Timetable" DROP COLUMN "day",
DROP COLUMN "lecture",
DROP COLUMN "subject",
DROP COLUMN "teacher",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timetable" JSONB NOT NULL;
