/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "isadmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'teacher',
ADD COLUMN     "userid" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userid");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");
