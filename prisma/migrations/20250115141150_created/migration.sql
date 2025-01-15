-- CreateTable
CREATE TABLE "Timetable" (
    "id" SERIAL NOT NULL,
    "day" INTEGER NOT NULL,
    "lecture" INTEGER NOT NULL,
    "teacher" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);
