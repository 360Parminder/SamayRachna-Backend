-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT NOT NULL DEFAULT 'Management',
ADD COLUMN     "mySubjects" TEXT[] DEFAULT ARRAY[]::TEXT[];
