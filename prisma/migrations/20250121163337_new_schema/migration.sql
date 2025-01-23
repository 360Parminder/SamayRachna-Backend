/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "profilepic" TEXT DEFAULT 'https://res.cloudinary.com/dvo4tvvgb/image/upload/v1737475056/Profile/i8dmjx8tps4wghatmgt3.jpg',
ALTER COLUMN "name" SET NOT NULL;
